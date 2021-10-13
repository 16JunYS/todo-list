/*tslint:disabled*/

let working = false
$(function() {
    let get_list = function() {
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
                    '<td> <input type="text" value="'+list[i].contents+'" disabled id="content_'+i+'"></td>' +
                    '<td><button type = "button" id="edit" class="btn btn-success">수정</button></td>' +
                    '<td><button type = "button" id="success" class="btn btn-success">완료</button></td>' +
                    '<td><button type = "button" id="delete" class="btn btn-danger">삭제</button></td>' +
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

    $('tbody').on('click', '#success', function() {
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
	$('tbody').on('click', '#delete', function () {
		$.ajax('/del', {
			'method': 'POST',
			'data': {
				'index': parseInt($(this).parent().siblings(':first').text()) - 1	// 선택한 행의 인덱스
			},
			'success': get_list
		});
	});
    $('tbody').on('click', '#edit', function() {
        let index = $(this).parent().siblings(':first').text()-1
        if (working == true) {
            if ($('#content_'+index+'').prop('disabled')) {
                alert('다른 todo 수정을 완료해주세요.')
            }
            else {
                //console.log($('#content_'+index+'').val())
                $.ajax('/edit', {
                    'method': 'POST',
                    'data': {
                        'idx': index,
                        'updated_todo': $('#content_'+index+'').val()
                    },
                    'success': get_list,
                    'error': function(error) {
                        alert(eval(error))
                    }
                })
            }
            working = false
        }
        else {
            $('#content_'+index+'').removeAttr('disabled')
            working = true
        }
    });
});