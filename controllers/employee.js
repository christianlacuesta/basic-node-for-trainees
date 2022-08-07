const Employee = require('../models/employee');

exports.getEmployees = (req, res, next) => {
    let newAtt = req.body.attributes;
    this.employee.getDocuments(xx)
    Employee.findAll({
        order: [ [ 'updatedAt', 'DESC' ]],
    })
    .then(employee => { 
        res.status(200).json(employee);
    })
    .catch(err => {
        console.log(err)
    });

    
};

exports.postEmployees = (req, res, next) => {
    console.log('xxxxxx', req.body)
    Employee.create({
        name: req.body.name,
        job: req.body.job,
    })
    .then(employee => { 
        res.status(201).json({
            message: 'Post Success',
            post: employee
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.putEmployees = (req, res, next) => {
    const idNo = req.params.idNo;

    Employee.findByPk(idNo)
    .then(employee => {
        employee.name = req.body.name,
        employee.job = req.body.job
        return employee.save();
    })
    .then(employee => {
        res.status(201).json({
            message: 'Put Success',
            post: employee
        });
    })
    .catch(err => {
        console.log(err)
    });
}


exports.deleteEmployees = (req, res, next) => {
    const idNo = req.params.idNo;
    Employee.findByPk(idNo)
    .then(employee => {
            employee.destroy();
    })
    .then(employee => {
        res.status(201).json({
            message: 'Delete Success',
            post: employee
        });
    })
    .catch(err => {
        console.log(err)
    });
}