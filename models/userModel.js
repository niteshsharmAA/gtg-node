const { DataTypes } = require('sequelize');

const UserSchema = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        email_id: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        mobile_number: {
            type: DataTypes.STRING
        },

        user_role: {
            type: DataTypes.STRING
        },
        user_type: {
            type: DataTypes.STRING
        },
        email_verify: {
            type: DataTypes.INTEGER
        },
        phone_verify: {
            type: DataTypes.INTEGER
        },
        mobile_auth_2fa: {
            type: DataTypes.INTEGER
        },
        mobile_2fa_otp: {
            type: DataTypes.STRING
        },
        two_fa_email_otp: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        google_auth_2fa: {
            type: DataTypes.INTEGER
        },
        google_otp_secrect_key: {
            type: DataTypes.STRING
        },

        social_id: {
            type: DataTypes.STRING
        },
        two_fa_email_otp: {
            type: DataTypes.INTEGER
        },
        login_otp : {
          type: DataTypes.INTEGER
        },
        phone_otp : {
          type: DataTypes.TEXT
        },
        aadhar_verify : {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
        pan_verify : {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
        user_image_verify:{
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
        account_type: {
          type: DataTypes.STRING
        },
        avatar : {
          type: DataTypes.TEXT
        },
  
        leverage : {
          type: DataTypes.TEXT
        },
        user_id : {
            type: DataTypes.UUID
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        }
        
    },
    options: {
        freezeTableName: true,
        timestamps: false
    },
};

module.exports = UserSchema;
