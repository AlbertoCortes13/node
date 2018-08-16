pipeline {
    //Dont change this. This agent definition keeps the jobs using up nodes for management. test    
    agent none
	
    //defining common variables.
    environment {
      GITHUB_URL = "https://bitbucket.org/gsw2018/node.git"
      PROJECT_NAME = "node_backend"
      BUILD_TAG = ""
      SONAR_SERVER = "TBD"
      ARTIFACT_NAME = "node_backend"
    }

    //Tools used by the pipeline go here
    tools {
        nodejs 'node_8.9.4'
        git 'Default'
    }
    options {
		disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr:'10'))
        timeout(time: 60, unit: 'MINUTES')
    }

    stages {
        stage ('Initialize') {
        agent { label 'k8s' }
        when{
            anyOf { 
                    branch 'master';
                    branch 'develop';
                    //Pull requests get built and features
                    expression{
                        return env.BRANCH_NAME.startsWith("PR-") ||
                            env.BRANCH_NAME.startsWith("feature")
                    }
                } 
            }
            steps {
            cleanWs()
                sh 'echo "Hello"'
                sh "printenv"
            }
        }
        stage('Building') {
        agent { label 'k8s' }
        when{
            anyOf { 
                    branch 'master';
                    branch 'develop';
                    //Pull requests get built and features
                    expression{
                        return env.BRANCH_NAME.startsWith("PR-") ||
                            env.BRANCH_NAME.startsWith("feature")
                    }
                }
        }
            steps {
                cleanWs()
                checkout scm
                //git branch: "${env.BRANCH_NAME.startsWith("PR-")? env.CHANGE_BRANCH : env.BRANCH_NAME}", credentialsId: 'john.r.kriter_bitbucket_access', url: "${GITHUB_URL}"


                nodejs(nodeJSInstallationName: 'node_8.9.4', configId:null) {
                    sh "ls -ltra"
                    sh "npm install"
                    sh "node -v"
                    sh "npm run package -- -s dev -r us-east-1 --package ../dist"
                }
                cleanWs()
            }
        }
		stage('Scanning') {
            agent { label 'k8s' }
            when{ //Trigger on dev, PR's, and feature branches
                anyOf {
                    branch 'dev';
                    branch 'master';
                    expression{
                        return env.BRANCH_NAME.startsWith("PR-") ||
                            env.BRANCH_NAME.startsWith("feature")
                    }
                }
            }
            steps {
                cleanWs()

                wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
                    git branch: "${env.BRANCH_NAME.startsWith("PR-")? env.CHANGE_BRANCH : env.BRANCH_NAME}", credentialsId: 'john.r.kriter_bitbucket_access', url: "${GITHUB_URL}"

                    echo 'Upload to sonarqube'
                    echo '${PROJECT_NAME}'

                    nodejs(nodeJSInstallationName: 'node_8.9.4', configId:null) {
                        sh """
                            ls -ltra
                            npm install
                            ls -ltra
                            npm run test
                            npm run test-coverage
                        """
                    }
                    
                    withSonarQubeEnv('sonarqube') {
                        sh """
                            ${tool 'sonarqube'}/bin/sonar-scanner \
                                -D sonar.serverUrl=\${SONAR_SERVER} \
                                -D sonar.projectKey=\${PROJECT_NAME}:\${BRANCH_NAME//\\//_} \
                                -D sonar.projectName=\${PROJECT_NAME}--\${BRANCH_NAME//\\//_} \
                                -D sonar.projectVersion=1.0.\${BUILD_NUMBER} \
                                -D sonar.sources=app \
                                -D sonar.sourceEncoding=UTF-8 \
                                -D sonar.typescript.lcov.reportPaths=coverage/lcov.info
                        """
                    }
                    sh 'sleep 15'
                }
            }
        }

        stage("Quality Gate"){
            agent { label 'k8s' }
            when{ //Trigger on dev, PR's, and feature branches
                anyOf {
                    branch 'dev';
                    expression{
                        return env.BRANCH_NAME.startsWith("PR-") ||
                            env.BRANCH_NAME.startsWith("feature")
                    }
                }
            }
            steps{
                script {
                    timeout(time: 1, unit: 'HOURS') { // Just in case something goes wrong, pipeline will be killed after a timeout
                    def qg = waitForQualityGate() // Reuse taskId previously collected by withSonarQubeEnv
                        if (qg.status != 'OK') {
                            echo "[FAILURE] Failed to build"
                            currentBuild.result = 'FAILURE'
                            exit
                        }
                    }
                }
            }
        }





        stage('Develop Deployment'){
        agent {label 'k8s'}
        when{
            anyOf { branch 'develop'}
        }
            steps{
                cleanWs()
                sh "ls -ltra"
                sh "curl -O -u sa-jenkins:REMOVE_ME -X GET https://REMOVE_ME/generic-serverless-reference-api/'$PROJECT_NAME'-build'$BUILD_NUMBER'.tar.gz"
                sh "tar -xvf '$PROJECT_NAME'-build'$BUILD_NUMBER'.tar.gz"

            }
        }
    }
}

















