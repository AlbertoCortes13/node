// http://docs.sequelizejs.com/manual/tutorial/models-definition.html

module.exports = (sequelize, DataTypes) => sequelize.define(
    'user', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        address: DataTypes.STRING,
        zipCode: DataTypes.STRING,
        isSeasonTicketHolder: DataTypes.BOOLEAN,
        isMediaMember: DataTypes.BOOLEAN,
        inBayArea: DataTypes.BOOLEAN,
        fbId: DataTypes.STRING,
    }, {
        timestamps: false, // Addds two columns to the query (createdAt and updatedAt)
        schema: 'gsw_schema',
        // Adds an S at the end of the table name (e.g. user => users, event = events)
        freezeTableName: true,
    },
);
