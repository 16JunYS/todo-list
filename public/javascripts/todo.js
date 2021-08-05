/*tslint:disabled*/

$(function() {
    var get_list = function() {
        $.ajax('/list', {
            'success': function(list) {
                var trs = '';
                try{
                    list = JSON.parse(list);
                    list = list.list
                } catch (e) {
                    console.log('json file empty');
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    trs += '<tr>' + 
                    '<td>' + (i+1) + '</td>' +
                    '<td>'+ list[i].contents +'</td>' +
                    '<td><button type = "button" class="btn btn-success">완료</button></td>' +
                    '<td><button type = "button" class="btn btn-danger">삭제</button></td>' +
                    '</tr>';
                }

                $('tbody').html(trs);
            }
        });
    };
    get_list();

    $('.form-inline button').on('click', function(){
        contents = $("#new_todo").val();
        $.ajax('/add', {
            'method' : 'POST',
            'dataType' : 'json',
            'data': {
                'contents': $("#new_todo").val()
            },
            'success': get_list
        });
    });

    $('tbody').on('click', '.btn-success', function(){
        $.ajax('/complete', {
            'method': 'POST',
            'dataType' : 'json',
            'data': {
                'index':
                parseInt($(this).parent().siblings(':first').text()) -1
            },
            'success': get_list
        })
    });
	$('tbody').on('click', '.btn-danger', function () {
		$.ajax('/del', {
			'method': 'POST',
			'data': {
				'index': parseInt($(this).parent().siblings(':first').text()) - 1	// 선택한 행의 인덱스
			},
			'success': get_list
		});
	});
});