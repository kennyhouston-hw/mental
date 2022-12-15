

const startCount = 3 // стартовый отсчет
const taskLim = 10 // макс. количество заданий

const termLim = 10 // макс. количество слагаемых
const addLim = 3 // макс. разряд для сложения/вычитания
const lineLim = 10 // макс. количество линий чисел в правиле

const multLim = 3 // макс. разряд для умножения
const divLim = 3 // макс. разряд для деления

afSetType()

// console.log(rules);

for (j in rules["r2 p5"])
    aRules5.innerHTML += '<option value="' + j + '">' + j + '</option>'
if (rules["r2 p10"]) for (j in rules["r2 p10"])
    aRules10.innerHTML += '<option value="' + j + '">' + j + '</option>'
if (rules["r2 p10a"]) for (j in rules["r2 p10a"])
    aRules10a.innerHTML += '<option value="' + j + '">' + j + '</option>'


aTerms.max = termLim
aAddBit1.max = addLim
aMultBit1.max = multLim
aMultBit2.max = multLim
aDivBit1.max = multLim
aDivBit2.max = divLim


var loop1, loop2, sch1,
    termsSch, termsVal,
    taskSch, taskVal,
    resEq, equalsOk,
    RUN = false,
    bit1, bit2, typeA,
    sRuleP, sRuleList, sRuleLine


function afStart() {
    if (RUN) {
        afStop()
        return
    }

    console.log('=== START ===');

    aStart.style.display = 'none'
    taskVal = aTask.value
    if (taskVal > taskLim) taskVal = taskLim
    aWin.style.display = 'block'
    aStop.style.display = 'block'
    aTaskSch.style.display = 'block'
    aTaskSch.innerHTML = 'Задание № 1'
    taskSch = 0
    RUN = true
    aCfg.classList.add('arith-cfg-dis')

    termsVal = aTerms.value
    if (termsVal > termLim) termsVal = termLim
    if (aType.value == 'mult') termsVal = 1
    if (aType.value == 'div') {
        termsVal = 1
        if (aDivBit2.value > aDivBit1.value) {
            afStop('Ошибка<br><br>Делимое меньше делителя')
            return
        }
    }

    sch1 = startCount
    aWin.innerHTML = '<span class="arith-starting">' + sch1 + '</span>'
    sch1--
    loop1 = setInterval(() => {
        aWin.innerHTML = '<span class="arith-starting">' + sch1 + '</span>'
        if (sch1 == 0) {
            clearInterval(loop1)
            afInit()
            afPrint()
        } else sch1--
    }, 1000)
}


function afInit() {
    aWin.innerHTML = ''
    taskSch++
    termsSch = 1
    resEq = 0
    equalsOk = 0
    typeA = aType.value
    if (typeA == 'add') {
        bit1 = aAddBit1.value
        if (bit1 > addLim) bit1 = addLim
        afSetRuleWrk()
    }
    if (typeA == 'mult') {
        bit1 = aMultBit1.value
        bit2 = aMultBit2.value
        if (bit1 > multLim) bit1 = multLim
        if (bit2 > multLim) bit2 = multLim
    }
    if (typeA == 'div') {
        bit1 = aDivBit1.value
        bit2 = aDivBit2.value
        if (bit1 > divLim) bit1 = divLim
        if (bit2 > divLim) bit2 = divLim
    }
    if (bit1 < 1) bit1 = 1
    if (bit2 < 1) bit2 = 1
}


function afSetRuleWrk() {
    // if (!sRuleList) return

    let sRuleMas = []
    if (sRuleList) sRuleList.childNodes.forEach(r => sRuleMas.push(r.innerHTML))
    let sRuleWrk = sRuleMas[afRandom(0, sRuleMas.length - 1)] // выбрать правило из вариантов 
    let sRuleKey = 'r' + bit1 + ' p' + sRuleP
    if (sRuleWrk == undefined) {
        sRuleKey = 'r' + bit1 + ' no'
        sRuleWrk = 'no'
    }
    if (sRuleWrk == 'Любые') {
        sRuleKey = 'r' + bit1 + ' any'
        sRuleWrk = 'any'
    }
    // if (sRuleWrk == 'Любые') {
    //     let m = []
    //     for (j in rules[sRuleKey]) m.push(j)
    //     sRuleWrk = m[afRandom(0, m.length - 1)]
    // }
    let sRuleNum = afRandom(0, lineLim - 1) // выбрать номер линии в правиле
    // console.log(sRuleKey, sRuleWrk, sRuleNum);
    sRuleLine = rules[sRuleKey][sRuleWrk][sRuleNum]

    console.log('-----------');
    console.log('Правило: ' + sRuleWrk);
    console.log('Номер: ' + sRuleNum);
    console.log('Числа: ' + rules[sRuleKey][sRuleWrk][sRuleNum].join(', '));
}


function afStop(s = '') {
    clearInterval(loop1)
    aWin.innerHTML = s
    if (s == '') {
        aStart.style.display = 'block'
        aStop.style.display = 'none'
        aWin.style.display = 'none'
    }
    RUN = false
    aTaskSch.style.display = 'none'
    aCfg.classList.remove('arith-cfg-dis')
}


function afPrint() {
    if (taskSch <= taskVal) {
        aTaskSch.innerHTML = 'Задание № ' + taskSch
        afGetNum()
        setTimeout(() => {
            if (!RUN) return

            if (termsSch == termsVal) {
                // одно для умножения и деления
                console.log('Итог = ' + resEq);
                aWin.innerHTML = 'Введите ответ: <br><input type="number" id="aEquals"><br>' +
                    '<div class="arith-btn" onclick="afCalc()">Ввод</div>'
            } else {
                // несколько для сложения
                termsSch++
                afPrint()
            }
        }, aInterval.value * 1000)
    } else {
        afStop('Результат: ' + equalsOk + '&nbsp;/&nbsp;' + taskVal)
    }
}


function afCalc() {
    if (aEquals.value.trim() == '') return

    const valEq = aEquals.value
    aTaskSch.style.display = 'block'
    aTaskSch.innerHTML = 'Задание № ' + taskSch

    if (resEq == valEq) {
        equalsOk++
        aWin.innerHTML = 'Правильно<br><br><div class="arith-btn" onclick="afNext()">Далее</div>'
    } else {
        aWin.innerHTML = 'Ошибка<br>' + valEq + ' ≠ ' + resEq + '<br><br><div class="arith-btn" onclick="afNext()">Далее</div>'
    }

    taskSch++
    termsSch = 1
}


function afNext() {
    resEq = 0
    if (taskSch <= taskVal) afSetRuleWrk()
    afPrint()
}


function afGetNum() {
    if (typeA == 'add') {
        n1 = sRuleLine[termsSch - 1]
        aWin.innerHTML = '<h2>' + n1 + '</h2>'
        resEq += parseInt(n1)
        // if (!sRuleList) {
        //     // без правил
        //     let n1, z = afZ()
        //     if (termsSch == 1) z = ''
        //     if (bit1 == 1) n1 = z + afRandom(1, 9)
        //     if (bit1 == 2) n1 = z + afRandom(10, 99)
        //     if (bit1 == 3) n1 = z + afRandom(100, 999)
        //     n1 = parseInt(n1)
        //     if ((resEq + n1) < 0) n1 *= -1
        //     console.log(resEq + n1);
        //     aWin.innerHTML = '<h2>' + n1 + '</h2>'
        //     resEq += n1
        // } else {
        //     // по правилам
        //     n1 = sRuleLine[termsSch - 1]
        //     aWin.innerHTML = '<h2>' + n1 + '</h2>'
        //     resEq += parseInt(n1)
        // }
    }

    if (typeA == 'mult') {
        let n1, n2
        if (bit1 == 1) n1 = afRandom(1, 9)
        if (bit1 == 2) n1 = afRandom(10, 99)
        if (bit1 == 3) n1 = afRandom(100, 999)
        if (bit2 == 1) n2 = afRandom(1, 9)
        if (bit2 == 2) n2 = afRandom(10, 99)
        if (bit2 == 3) n2 = afRandom(100, 999)

        aWin.innerHTML = '<h2>' + n1 + '&nbsp;x&nbsp;' + n2 + '</h2>'
        resEq = n1 * n2
    }

    if (typeA == 'div') {
        let n1, n2, i = 0
        for (i = 0; i < 10000; i++) {
            if (bit1 == 1) n1 = afRandom(1, 9)
            if (bit1 == 2) n1 = afRandom(10, 99)
            if (bit1 == 3) n1 = afRandom(100, 999)
            if (bit2 == 1) n2 = afRandom(1, 9)
            if (bit2 == 2) n2 = afRandom(10, 99)
            if (bit2 == 3) n2 = afRandom(100, 999)
            resEq = n1 / n2
            if (n2 != 1 && n1 != n2 && Number.isInteger(n1 / n2)) break
        }

        if (i == 10000) {
            afStop('Ошибка.<br>Не получается подобрать число.')
        } else {
            aWin.innerHTML = '<h2>' + n1 + '&nbsp;/&nbsp;' + n2 + '</h2>'
            resEq = Math.round(n1 / n2)
        }
    }
}



function afRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function afZ() {
    if (Math.random() > 0.5) return '-'
    else return ''
}


function afSetType() {
    aAdd.style.display = 'none'
    aMult.style.display = 'none'
    aDiv.style.display = 'none'
    if (aType.value == 'add') aAdd.style.display = 'block'
    if (aType.value == 'mult') aMult.style.display = 'block'
    if (aType.value == 'div') aDiv.style.display = 'block'
}


function afSetRule(e) {
    const rname = e.value
    sRuleP = e.getAttribute('p')

    aRules5.value = ''
    aRules10.value = ''
    aRules10a.value = ''

    if (sRuleP == '5') {
        aRules5.value = rname
        sRuleList = aRules5List
        aRules10List.innerHTML = ''
        aRules10aList.innerHTML = ''
    }
    if (sRuleP == '10') {
        aRules10.value = rname
        sRuleList = aRules10List
        aRules5List.innerHTML = ''
        aRules10aList.innerHTML = ''
    }
    if (sRuleP == '10a') {
        aRules10a.value = rname
        sRuleList = aRules10aList
        aRules5List.innerHTML = ''
        aRules10List.innerHTML = ''
    }

    if (rname == '') {
        sRuleList.innerHTML = ''
        sRuleList = undefined
    }
    else if (rname == 'any') {
        sRuleList.innerHTML = ''
        const btn = document.createElement('div')
        btn.innerHTML = 'Любые'
        btn.onclick = () => btn.remove()
        sRuleList.appendChild(btn)
    }
    else {
        sRuleList.childNodes.forEach(e => {
            if (e.innerHTML == 'Любые') e.remove()
        })
        const btn = document.createElement('div')
        btn.innerHTML = rname
        btn.onclick = () => btn.remove()
        sRuleList.appendChild(btn)
    }
}










