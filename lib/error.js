
let cont = 0
const errors = {
  noToken: {code: cont++, message: 'Incorrect token'},
  noIdFound: {code: cont++, message: 'The field does not exist'},
  noInfoCreateUser: {code: cont++, message: 'A new user need at least name, first_surname, second_surname, nickname, email, birthday, studies,proffessions and prev_volunteering'},
  noIdAttr: {code: cont++, message: 'There is not element with this attribute'},
  nullParam: {code: cont++, message: 'Required params missing'},
  incorrectPsw: {code: cont++, message: 'Incorrect password'},
  incorrectRole: {code: cont++, message: 'Incorrect Role'},
  noPrivileges: {code: cont++, message: 'Not Authorized'},
  notAuthenticated: {code: cont++, message: 'Not registered'},
  noUser: {code: cont++, message: 'This user does not exist'}, 

  noInfoCreateState: {code: cont++, message: 'A new user need at least a prev_state_id, value, user_id and sheet_id'},
  notExistantPrevId: {code: cont++, message: 'The previous id should be null or a available idState'},
  prevIdexist: {code: cont++, message: 'The previous id should not be assigned'},
 
  noInfoCreateSheet: {code: cont++, message: 'A new sheet should have at least name, first surname, zone and addres'}
}
module.exports = {
  noToken: () => errors.noToken,
  noIdFound: () => errors.noIdFound,
  noInfoCreateUser: () => errors.noInfoCreateUser,
  noIdAttr: () => errors.noIdAttr,
  nullParam: () => errors.nullParam,
  incorrectPsw: () => errors.incorrectPsw,
  incorrectRole: () => errors.incorrectRole,
  noPrivileges: () => errors.noPrivileges,
  notAuthenticated: () => errors.notAuthenticated,
  noUser: () => errors.noUser, 

  noInfoCreateState: () => errors.noInfoCreateState, 
  notExistantPrevId: () => errors.notExistantPrevId,
  prevIdexist: () => errors.prevIdexist,
 
 
  noInfoCreateSheet: () => errors.noInfoCreateSheet
}
