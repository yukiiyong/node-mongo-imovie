$(function(){
	$('.del').click(function(e){  //处理del删除按钮，并发起一个delete请求
		var target=$(e.target)
		var id=target.data('id')
		var tr=$('.item-id-'+id)

		$.ajax({
			type:'DELETE',
			url:'/admin/list?id='+id
		})
		.done(function(result){

			if(result.success==1){
				if(tr.length > 0){
					tr.remove()
				}
			}
		})
	})
})