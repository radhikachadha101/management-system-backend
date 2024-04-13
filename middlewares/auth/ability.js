
const { AbilityBuilder, Ability } = require('@casl/ability');
const userGroupAccess = {
  Common: [{
    action: "manage",
    subject: "Common"
  }],
  ADMIN: [
    {
      action: "manage",
      subject: "all"
    }
  ],
  Dev: [
    {
      action: ['read', 'write', 'update', 'remove'],
      subject: ['Timesheet']
    },
    {
      action: ['read'],
      subject: ['Projects']
    },
    {
      action: ['read','write'],
      subject: ['Comments']
    }
  ],
  TeamLead: [
    {
      action: ['read', 'write', 'update', 'remove'],
      subject: ['Timesheet']
    },
    {
      action: 'read',
      subject: ['Reports', 'Projects']
    },
     {
      action: ['read','write'],
      subject: ['Comments']
    }
  ],
  HRManager: [
    {
      action: 'read',
      subject: ['Users']
    } ],
    BDManager: [
      {
        action: 'read',
        subject: ['Users','UserGroupPermission']
      } ],
      BDTrainee: [
        {
          action: 'read',
          subject: ['UserGroupPermission']
        } ],


}
function defineAbilitiesFor (userGroup) {
  const { rules, can } = new AbilityBuilder();
  const userGroupArray = ['Common'];
  if(userGroup) {
    userGroupArray.push(userGroup);
  }
  userGroupArray.forEach(currentUserGroup => {
    if(currentUserGroup == 'HR MANAGER'){
      currentUserGroup = 'HRManager'
    }
    if(currentUserGroup == 'BD MANAGER'){
      currentUserGroup = 'BDManager'
    }
    if(currentUserGroup == 'BD TRAINEE'){
      currentUserGroup = 'BDTrainee'
    }
    const permissions = userGroupAccess[currentUserGroup];
    if(permissions && permissions.length) {
      permissions.forEach(permission => {
        can(permission.action, permission.subject);
      })
    }
  })
  return new Ability(rules)
}
const getActionFromMethod = (method) => {
  switch(method) {
    case 'GET': return 'read';
    case 'PUT': return 'update';
    case 'POST': return 'write';
    case 'DELETE': return 'remove';
    default: return 'manage';
  }
}
const getSubjectFromPath = (path) => {
  let startsWith = (startsVal) => path && path.startsWith(startsVal)
  switch(true) {
    case startsWith('/users'):
    case startsWith('/userGroup'):
      return 'Users';
    case startsWith('/tasks'):
      return 'Timesheet';
    case startsWith('/comments'):
      return 'Comments';
    case startsWith('/projects'):
    return 'Projects';
    case startsWith('/userGroupPermission'):
    return 'UserGroupPermission';
    default: return 'Common';
  }
}
module.exports = (req, res, next) => {
  const ability = defineAbilitiesFor(req.user && req.user.userGroup);
  const action = getActionFromMethod(req.method);
  const subject = getSubjectFromPath(req.path);
  const canAccess = ability.can(action, subject);
  if (canAccess) {
    return next()
  } else {
    return res.status(403).json({
      message: `You are not authorized to ${action}`
    })
  }
}
