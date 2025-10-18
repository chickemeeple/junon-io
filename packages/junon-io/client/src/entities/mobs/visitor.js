const LandMob = require('./land_mob')
const Constants = require("../../../../common/constants.json")
const Protocol = require("../../../../common/util/protocol")
const ClientHelper = require("../../util/client_helper")
const Equipper = require('../../../../common/interfaces/equipper')


class Visitor extends LandMob {
    constructor(game, data) {
        super(game, data)

        this.initEquipper();
    }
    animateEquipment() {
        let targetPosition = this.getMeleeTarget()
        this.attackTween = this.getMeleeChargeTween(targetPosition)
        this.attackTween.start()
    }

    setArmorType(armorType) {
        super.setArmorType(armorType);
        this.updateHatAccordingToArmor(armorType);
    }

    updateHatAccordingToArmor(armorType) {
        let armor = armorType ? "armorOn" : "armorOff";
        let constants = this.getConstants().hat[armor][this.hatSpritePath.replace(".png", "")];
        this.hat.x = constants.x;
        this.hat.y = constants.y;
        this.hat.width = this.hat.height = constants.size;
    }

    getBaseRotationOffset() {
        return 0 * PIXI.DEG_TO_RAD
    }

    getSpritePath() {
        return "player_body.png";
    }

    getType() {
        return Protocol.definition().MobType.Visitor
    }

    getConstantsTable() {
        return "Mobs.Visitor"
    }
}

Object.assign(Visitor.prototype, Equipper.prototype, {
    getDefaultSpriteColor() {
        return 0xd2b48c
    },
})
module.exports = Visitor
