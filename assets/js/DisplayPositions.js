var positions = []

$(window).load(function () {
    $.get('/getEmployees', function (employees, err) {
        employees.map(employee => {
            if(!(positions.includes(employee.position))){
                positions.push(employee.position)
            }
        })
        
        positions.map(position => {
            $(".positions-dropdown").append(
                `
                <option value="${position}">${position}</option>
                `
            )
        })
    });
});