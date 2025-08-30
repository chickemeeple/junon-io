const RPItems = require("../entities/RPItems/index")
const BaseMenu = require("./base_menu");
const SocketUtil = require("./../util/socket_util")

class RPMenu extends BaseMenu {
  open() {
    super.open()
    this.el.querySelector("#RP_level").innerHTML = this.game.sector.RPLevel;
    this.el.querySelector(".craft_btn").addEventListener("click", this.onUnlockBtnClick.bind(this) , true)

    this.render()
  }

  onUnlockBtnClick(e) {
    if(!this.id) return;
    let klass = this.game.getItemKlass(this.id)

    if (!klass.prototype.isRPItem()) return;
    let requiredRP = klass.prototype.getRequiredRP() || klass.prototype.getConstants().requiredRP
    if (!requiredRP) return;

    if (!this.game.sector.RPLevel < requiredRP) {
      SocketUtil.emit("UnlockItem", {type: this.id})
      
      return;
    }

  }

  onMenuConstructed() {
    this.el.querySelector(".product_container").addEventListener("click", this.onProductSelection.bind(this))

  }

  onProductSelection(e) {
    let el = e.target.closest(".item_selection")
    if (!el) return

    let selectedItem = this.el.querySelector(".item_selection.selected")
    if (selectedItem) {
      selectedItem.classList.remove("selected")
    }

    this.renderItemStats(el)
    el.classList.add("selected")
  }

  renderItemStats(e) {
    let klass = this.game.getItemKlass(e.dataset.type)
    this.id = e.dataset.type

    if (!klass.prototype.isRPItem()) return;
    let requiredRP = klass.prototype.getRequiredRP() || klass.prototype.getConstants().requiredRP
    if (!requiredRP) return;

    this.el.querySelector("#RP_count").innerHTML = requiredRP
    if (this.game.sector.RPLevel < requiredRP) {
      this.el.querySelector(".craft_btn").dataset.disabled = true
      return;
    }

    if(this.game.sector.unlockedItems.indexOf(klass.prototype.constructor.name) != -1) {
      this.el.querySelector(".craft_btn").dataset.disabled = true
      return;
    }

    delete this.el.querySelector(".craft_btn").dataset.disabled
  }

  render() {
    if (this.initialized) return;
    let el = ""
    for (let name in RPItems) {
      let RPItemKlass = RPItems[name];
      el += this.createRPSelection(RPItemKlass)
      this.el.querySelector(".craft_btn").dataset.disabled = true


    }
    this.el.querySelector(".product_container").innerHTML += el
    this.initialized = true;
  }

  createRPSelection(klass) {
    let imagePath = "/assets/images/" + klass.prototype.getSpritePath();
    const el = "<div class='item_selection' data-type='" + klass.getType() + "' data-name='" + i18n.t(klass.getTypeName()) + "' >" +
      "<img width='30' class='item_image' src='" + imagePath + "'>" +
      "</div>"

    return el
  }

}

module.exports = RPMenu