console.log('DEFINIENDO GlobalConfig');

/**
 * Configuracion global.
 * @class
 */
function GlobalConfig() {
    this.profile = "dev";
}

/**
 * Establece el perfil de desarrollo.
 * @param {string} profile Perfil usado (ej: "test").
 * @return {GlobalConfig} this.
 */
GlobalConfig.prototype.setProfile = function (profile) {
    this.profile = profile;
    return this;
};

const globalCfg = new GlobalConfig();

module.exports = globalCfg;