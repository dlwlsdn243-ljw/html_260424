const container = document.querySelector('.container');
const printResult = document.getElementById('printResult');
let printValue = ''; // 출력 문구를 적을 변수
let isResultShow = false; // 결과가 표시된 상태인지를 추적

// console.log(container, printResult);

// 전체 계산기 화면 이벤트 
container.addEventListener('click',(e)=>{
    console.log(e.target.value);
    let btnValue = e.target.value;

    // value가 없는 부분은 undefined
    if(btnValue === undefined) return;

    if(!isNaN(btnValue)){
        // btnValue : 숫자인경우  ! isNaN => true (숫자가 아니다)
        if(isResultShow){
            // 새로운 계산 시작
            printValue = btnValue; // 지난 결과를 지우고 덮어씀
            isResultShow = false;
        }else{
            printValue += btnValue;
        }

    }else{
        // btnValue : 숫자가 아닌 경우  (+-*/), (. C =)

        // 결과에 값이 없는데 연산자가 먼저 나오는 경우 0으로 변경
        if(printValue == '' && ['+','-','*','/','.'].includes(btnValue)){
            printValue = '0';
        }
        switch(btnValue){
            case 'c': 
                // 초기화
                printValue = '';
                printResult.innerText='0';
            return;

            case '.': 
                // 소수점은 숫자뒤에 붙이기(연속 발생 방지)
                // 2.3 + 6..X   2.3+ 9.3.6 X 
                // const parts = printValue.split(/[\+\-\*\/]/);
                // if(!parts.pop().includes('.')){
                //     printValue += btnValue;
                // } 
                const parts = printValue.split(/[\+\-\*\/]/);
                let last = parts.pop();
                if(!last.includes('.')){
                    printValue += last.length == 0 ? "0"+btnValue : btnValue;
                }
            break;
            
            default : 
            // 계산
            let result = 0; // 실제 연산의 결과를 받을 변수
            if(btnValue == '='){
                // 계산하기
                result = extractValue(printValue);
                printValue = result;
                isResultShow = true;

            }else{
                // + - * /   123 + 456 
                // search regEx pattern을 이용한 검색 후 index 리턴

                // 결과가 표시된 상태에서 연산자를 붙이면 => 이어서 계산
                if(isResultShow){
                    isResultShow = false;
                }

                // 연산자가 두번 연속 눌릴경우 => 이전 연산자를 다음 연산자로 교체
                // 1. 마지막 문자가 연산자인지 확인
                
                if(/[\+\-\*\/]$/.test(printValue)){
                    //2. 마지막 연산자를 새연산자로 교체
                    printValue = printValue.slice(0, -1) + btnValue;
                }else{
                    printValue += btnValue; 
                }
                
            }
        }

    }

    printResult.innerText = printValue;
});

function operation(f, o, l){
    // 계산
    f = Number(f);
    l = Number(l);
    let result = 0;

    switch(o){
        case '+': result = f + l; break;
        case '-': result = f - l; break;
        case '*': result = f * l; break;
        case '/': 
            if(l == 0){
                alert('0으로 나눌 수 없습니다.');
                return 0;
            }
            result = f / l; 
        break;
        default: break;
    }

    return result.toFixed(2);
}


function extractValue(strValue){
    // strValue 123 + 456
    // substring(시작번지, 끝번지)
    // let firstNumber = strValue.substring(0, strValue.indexOf(" "));
    // let lastNumber = strValue.substring(strValue.lastIndexOf(" ")+1);
    // let op = strValue.substr(strValue.indexOf(" ")+1, 1);

    // search regEx pattern을 이용한 검색 후 index 리턴
    console.log(strValue.search(/[\+\-\*\/]/));
    let firstNumber = strValue.substring(0,strValue.search(/[\+\-\*\/]/));
    let lastNumber = strValue.substring(strValue.search(/[\+\-\*\/]/)+1);
    let op = strValue.charAt(strValue.search(/[\+\-\*\/]/));
    console.log(firstNumber);
    console.log(op);
    console.log(lastNumber);

    return operation(firstNumber, op, lastNumber);
}