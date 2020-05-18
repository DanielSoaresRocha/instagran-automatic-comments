const { Builder, By, JavascriptExecutor } = require("selenium-webdriver")
const listFriends = require('./friends')


//========================================================================
const user = '' // your email to log into instagran
const password = '' // your password to log into instagran
const link_pag_post = '' // publication that the robot will comment on
//============================================================================ 
let driver;
let cont = 0;

// login into instagran
async function login () {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://www.instagram.com/")
    await driver.sleep(5000)
    let elements = await driver.findElements(By.className('_2hvTZ pexuQ zyHYP'))
    elements[0].sendKeys(user) // campo usuário
    elements[1].sendKeys(password) // campo senha
    await driver.findElement(By.className('sqdOP L3NKy y3zKF')).click() // entrar
    await driver.sleep(6000)
    goPublication()
}

async function goPublication () {
    await driver.get(link_pag_post)
    await driver.sleep(3000)
    await driver.findElement(By.className('RxpZH')).click() // clicar no campo comentario
    await driver.sleep(2000)
    let campo_comentario = await driver.findElement(By.className('Ypffh'))// encontrar o campo
    await driver.sleep(2000)
    let comentar = await driver.findElement(By.xpath('//*[@id="react-root"]/section/main/div/div[1]/article/div[2]/section[3]/div/form/button'))// botão publicar
    await driver.sleep(2000)
    comments(campo_comentario, comentar)
}

// versão para ser revisada. porém funcional.
async function comments (campo_comentario, comentar) {
    await campo_comentario.click().then(async () => {
        for (i = 0; i < 2; i++) {
            await digitarLentamente(listFriends[cont], campo_comentario)
            campo_comentario.sendKeys(' ')
            cont++
        }
        await driver.sleep(2000)
        await public(comentar, driver, campo_comentario)
    }, async () => {
        console.log("===> comentários bloqueados, tentando novamente dentro de 5 minutos: <===")
        await driver.sleep(300000)
        public(comentar, driver, campo_comentario)
    })
}

async function public (comentar, driver, campo_comentario) {
    await comentar.click()
    await driver.sleep(5000)
    console.log('comentário nº ' + (cont + 1))
    comments(campo_comentario, comentar)
}

async function digitarLentamente (comentario, campo_comentario) {
    for (let i = 0; i < comentario.length; i++) {
        campo_comentario.sendKeys(comentario[i])
        await driver.sleep(getRandomArbitrary(200, 400))
    }
}

function getRandomArbitrary (low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}

login()