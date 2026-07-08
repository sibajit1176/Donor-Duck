const User=require('./user')
const Charity=require('./charity')

User.hasOne(Charity, {
    foreignKey: "userId",
    as: "charity",
});

Charity.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

Charity.hasMany(CharityProject, {
    foreignKey: "charityId",
    as: "projects",
});

CharityProject.belongsTo(Charity, {
    foreignKey: "charityId",
    as: "charity",
});