function err(code, errMsg) {
  const error = {errors: {code: code, message: errMsg}}
  return error
}
module.exports = {
  noToken: () => err(0, 'Incorrect token'),
  noIdFound: () => err(1, 'The field does not exist'),
  noInfoCreateUser: () => err(2, 'A new user need at least name, first_surname, second_surname, nickname, email, birthday, studies,proffessions and prev_volunteering'),
  noUsers: () => err(3, 'There are not users in the DB'),
  noIdAttr: () => err(4, 'There is not element with this attribute'),
  nullParam: () => err(5, 'There are null params'),
  incorrectPsw: () => err(6, 'Incorrect password'),
  incorrectRole: () => err(7, 'Incorrect Role'),
  noId: () => err(8, 'The id is charged automatically'),
  noPrivileges: () => err(9, 'The user do not have the privileges'),
  noUserHeader: () => err(10, 'There is not user in the header'),
  noUser: () => err(11, 'The user is not in the DB'),

  noInfoCreateSheet: () => err(12, 'A new sheet need at least the fields name, firstSurname, secondSurname, tel and address'),
  noSheets: () => err(13, 'There are not sheets in the DB'),
  noSheetId: () => err(14, 'There is not Sheet with this id'),
  
  noVisits: () => err(15, 'There are not visits on the DB'),
  noVisitId: () => err(16, 'The visit is not on the DB'),
}
