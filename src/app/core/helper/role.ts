export const hasRoles = (roleCode) => {
    let roleList = JSON.parse(localStorage.getItem('USER_ROLES'));
    let roles = roleList.filter(role =>
        role.code === roleCode
    );
    return roles.length > 0;
}
