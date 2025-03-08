import { ClickButton, ComButton, Menu, ViewButton } from 'tnwx'

export class MenuManager {
  static getMenu(): Menu {
    const btn11 = new ViewButton()
    btn11.setName = '官方网站'
    btn11.setType = 'view'
    btn11.setUrl = 'https://www.quotawish.com'

    const btn12 = new ViewButton()
    btn12.setName = 'ThisAI'
    btn12.setType = 'view'
    btn12.setUrl = 'https://ai.quotawish.com'

    const btn13 = new ViewButton()
    btn13.setName = 'Touch'
    btn13.setType = 'view'
    btn13.setUrl = 'https://quotawish.com'

    const btn21 = new ClickButton()
    btn21.setName = '虚拟MFA'
    btn21.setType = 'click'
    btn21.setKey = 'virtual_mfa'

    const btn22 = new ClickButton()
    btn22.setName = '内测中心'
    btn22.setType = 'click'
    btn22.setKey = 'internal_test'

    const btn23 = new ClickButton()
    btn23.setName = '推广拉新'
    btn23.setType = 'click'
    btn23.setKey = 'invitation'

    const btn31 = new ClickButton()
    btn31.setName = '官方交流群'
    btn31.setType = 'click'
    btn31.setKey = 'contact_group'

    const btn32 = new ViewButton()
    btn32.setName = '在线咨询'
    btn32.setType = 'view'
    btn32.setUrl = 'http://wpa.qq.com/msgrd?v=3&uin=572839485&site=qq&menu=yes'

    const mainBtn1 = new ComButton()
    mainBtn1.setName = '产品选择'
    mainBtn1.setSubButton = [btn11, btn12, btn13]

    const mainBtn2 = new ComButton()
    mainBtn2.setName = '账户安全'
    mainBtn2.setSubButton = [btn21, btn22, btn23]

    const mainBtn3 = new ComButton()
    mainBtn3.setName = '联系我们'
    mainBtn3.setSubButton = [btn31, btn32]

    const menu = new Menu()
    menu.setButton = [mainBtn1, mainBtn2, mainBtn3]

    return menu
  }
}
