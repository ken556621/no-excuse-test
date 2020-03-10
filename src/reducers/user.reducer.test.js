import registerReducer from "./user.reducer";


describe("post reducer", () => {
  const initiaState = {
    authenticated: false,
    authenticating: true
  }
  
  const successAction = {
    type: "LOGIN_SUCCESS"
  }

  const failAction = {
    type: "LOGIN_FAIL"
  }

  const logoutAction = {
    type: "LOGOUT"
  }

  const updateAction = {
    type: "UPDATE_USER",
    uid: "",
    name: "",
    email: "",
    photo: ""
  }

  const mockLoginSuccessData = {
    authenticated: true,
    authenticating: false
  }

  const mockLoginFailData = {
    authenticated: false,
    authenticating: false
  }

  const mockLogoutData = {
    authenticated: false,
    authenticating: true
  }

  const mockUpdateData = {
    authenticated: false,
    authenticating: true,
    uid: "",
    name: "",
    email: "",
    photo: ""
  }

  it("should return the initial state", () => {
    expect(registerReducer(undefined, {})).toEqual(initiaState);
  });

  it("handle login success", () => {
    expect(registerReducer(undefined, successAction)).toEqual(mockLoginSuccessData);
  });

  it("handle login fail", () => {
    expect(registerReducer(undefined, failAction)).toEqual(mockLoginFailData);
  });

  it("handle logout", () => {
    expect(registerReducer(undefined, logoutAction)).toEqual(mockLogoutData);
  });

  it("handle update user", () => {
    expect(registerReducer(undefined, updateAction)).toEqual(mockUpdateData);
  });
});