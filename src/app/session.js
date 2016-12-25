const CLIENT_ID_VARNAME       = 'sessionClientID'
const EXPIRATION_SECS_VARNAME = 'sessionExpTimestampSecs'
const TOKEN_VARNAME           = 'sessionToken'
const UID_VARNAME             = 'sessionUID'

const STORAGE_VARNAMES = [
  CLIENT_ID_VARNAME,
  EXPIRATION_SECS_VARNAME,
  TOKEN_VARNAME,
  UID_VARNAME
]

function getTimestampSecs() {
  // convert MS epoch to Secs epoch:
  return Math.floor(Date.now() / 1000)
}

class Session {

  static set({ clientID, expirationSecs, token, uid }) {
    Session.clear()
    Session._setSessionVar(CLIENT_ID_VARNAME,       clientID)
    Session._setSessionVar(EXPIRATION_SECS_VARNAME, expirationSecs)
    Session._setSessionVar(TOKEN_VARNAME,           token)
    Session._setSessionVar(UID_VARNAME,             uid)
  }

  static getClientID() {
    return Session._getSessionVar(CLIENT_ID_VARNAME)
  }

  static getToken() {
    return Session._getSessionVar(TOKEN_VARNAME)
  }

  static getUID() {
    return Session._getSessionVar(UID_VARNAME)
  }

  static _getSessionVar(varName) {
    return localStorage.getItem(varName)
  }

  static _setSessionVar(varName, value) {
    localStorage.setItem(varName, value)
  }

  static _isExpired() {
    const expirationSecs = Session._getSessionVar(EXPIRATION_SECS_VARNAME)
    if (!expirationSecs || (expirationSecs < getTimestampSecs())) {
      return true
    }
  }

  static clear() {
    STORAGE_VARNAMES.forEach((varName) => {
      localStorage.removeItem(varName)
    })
  }

  static _hasSession() {
    return STORAGE_VARNAMES.every((varName) => !!Session._getSessionVar(varName))
  }

  static isActive() {
    if (!Session._hasSession()) {
      Session.clear() // session info may be incomplete, so clear
      return false
    } else if (Session._isExpired()) {
      Session.clear()
      return false
    }
    return true
  }

}

export default Session
