const User=require('./user')
const Charity=require('./charity');
const CharityProject = require('./charityProject');
const Donation = require('./donationhitoryTable');

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
Donation.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

Donation.belongsTo(Charity, {
    foreignKey: "charityId",
    as: "charity",
});

Donation.belongsTo(CharityProject, {
    foreignKey: "projectId",
    as: "project",
});
