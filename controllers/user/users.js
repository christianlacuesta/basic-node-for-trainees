const Users = require('../../models/users/users');
const UserRoles = require('../../models/users/user-roles/user-roles');
const { Op, Sequelize, QueryTypes } = require("sequelize");
const sequelize = require('../../helpers/database');

exports.getUsers = async(req, res, next) => {

    const orderBy = [[ 'userId', 'DESC' ]];
    // const orderBy = req.body.order? req.body.order : [ [ 'updatedAt', 'DESC' ]];
    const organizationId = req.body.organizationId;
    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    if (req.body.createdById !== '1') {
        Object.assign(tableConditions, {where: {organization: {value: { organizationId: organizationId} }}});
    } else {
        Object.assign(tableConditions, {where: {} });
    }
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions, {limit: req.body.limit});
    Object.assign(tableConditions, {offset: req.body.offset});
    for (let i = 0; objKeys.length > i; i++) {
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'recordPermission') {
            await UserRoles.findAll({
                where: {
                  groupId: {[Op.in]: whereCondition[objKeys[i]].arrayFilter}
                }
            }).then(userRoles => {
                let users = [];
                for (let i = 0; userRoles.length > i; i++) {
                    users.push(userRoles[i].userId);
                }
                const textFilterObj = {[Op.in]: users};
                Object.assign(tableConditions.where, {['userId']: textFilterObj})
            });
        } 
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'text') {
            const textFilterObj = {[Op.like]: `%${whereCondition[objKeys[i]].value}%`};
            Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj})
        } 
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'number') {
            const textFilterObj = {[Op.like]: `%${whereCondition[objKeys[i]].value}%`};
            Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj})
        } 
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'date') {
            if (whereCondition[objKeys[i]].dateFilter) {
                const textFilterObj = {[Op.and]: [
                    { [Op.gte]: new Date(whereCondition[objKeys[i]].dateFilter.dateFrom).setUTCHours(0,0,0,0) + (3600 * 1000 * 24)} , 
                    { [Op.lte]: new Date(whereCondition[objKeys[i]].dateFilter.dateTo).setUTCHours(23,59,59,999) + (3600 * 1000 * 24)} 
                ]};
                Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj})
            }
        } 
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'array') {
            if (whereCondition[objKeys[i]].arrayFilter) {
                if (!whereCondition[objKeys[i]].arrayFilter.value) {
                    const textFilterObj = {[objKeys[i]]: {name: whereCondition[objKeys[i]].arrayFilter.name } };
                    Object.assign(tableConditions.where, textFilterObj)
                } else {
                    const textFilterObj = {[objKeys[i]]: {value: { name: whereCondition[objKeys[i]].arrayFilter.value.name} } };
                    Object.assign(tableConditions.where, textFilterObj)
                }
            }
        } 

    }

    Users.findAndCountAll(tableConditions)
    .then(users => { 
        res.status(200).json(users);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getUser = (req, res, next) => {
    const userId = req.params.userId;
    Users.findByPk(userId)
    .then(user => { 
        res.status(200).json(user);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createUser = (req, res, next) => {
    Users.create({
        username: req.body.username,
        password: req.body.password,
        accessType: req.body.accessType,
        title: req.body.title,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        nationalId: req.body.nationalId,
        companyId: req.body.companyId,
        medicalId: req.body.medicalId,
        doctorId: req.body.doctorId,
        driverId: req.body.driverId,
        proffessionId: req.body.proffessionId,
        studentId: req.body.studentId,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        nationality: req.body.nationality,
        organization: req.body.organization,
        department: req.body.department,
        section: req.body.section,
        position: req.body.position,
        email: req.body.email,
        phone: req.body.phone,
        mobile: req.body.mobile,
        photo: req.body.photo,
        documents: req.body.documents,
        groups: req.body.groups,
        contacts: req.body.contacts,
        education: req.body.education,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName,
        permission: req.body.permission
    })
    .then(user => { 
        res.status(201).json({
            message: 'Post Success',
            post: user
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateUser = (req, res, next) => {
    const userId = req.params.userId;
    Users.findByPk(userId)
    .then(user => { 
        user.username = req.body.username,
        user.password = req.body.password,
        user.accessType = req.body.accessType,
        user.title = req.body.title,
        user.firstName = req.body.firstName,
        user.middleName = req.body.middleName,
        user.lastName = req.body.lastName,
        user.nationalId = req.body.nationalId,
        user.companyId = req.body.companyId,
        user.medicalId = req.body.medicalId,
        user.doctorId = req.body.doctorId,
        user.driverId = req.body.driverId,
        user.proffessionId = req.body.proffessionId,
        user.studentId = req.body.studentId,
        user.gender = req.body.gender,
        user.dateOfBirth = req.body.dateOfBirth,
        user.nationality = req.body.nationality,
        user.organization = req.body.organization,
        user.department = req.body.department,
        user.section = req.body.section,
        user.position = req.body.position,
        user.email = req.body.email,
        user.phone = req.body.phone,
        user.mobile = req.body.mobile,
        user.photo = req.body.photo,
        user.documents = req.body.documents,
        user.groups = req.body.groups,
        user.contacts = req.body.contacts,
        user.education = req.body.education,
        user.createdById = req.body.createdById,
        user.createdByName = req.body.createdByName,
        user.updatedById = req.body.updatedById,
        user.updatedByName = req.body.updatedByName,
        user.permission = req.body.permission
        return user.save();
    })
    .then(user => {
        res.status(201).json({
            message: 'Put Success',
            post: user
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteUser = (req, res, next) => {
    const userId = req.params.userId;
    Users.findByPk(userId)
    .then(user => { 
        return user.destroy();
    })
    .then(user => {
        res.status(201).json({
            message: 'Delete Success',
            post: user
        });
    })
    .catch(err => {
        console.log(err)
    });
};