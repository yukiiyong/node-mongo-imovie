$(function(){
	//$(document).ready(function(){
		if($("#movie").attr('name')=='movie[_id]'){
			 getCategoryList()
		}
	//})
	
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
	$('.Categorydel').click(function(e){
		var target=$(e.target)
		var id=target.data('id')
		var tr=$('.item-id-'+id)

		$.ajax({
			type:'DELETE',
			url: '/admin/category/list?id='+id
		})
		.done(function(result){
			if(result.success==1){
				if(tr.length>0){
					tr.remove()
				}
			}
		})
	})
	$("#douban").blur(function(){
		//var target=$(e.target)
		var id=$(this).val()
		id=parseInt(id)
		//douban ajax search title
		if(id){  
			$.ajax({
				type:'GET',
				url:'https://api.douban.com/v2/movie/subject/'+id,
				dataType:'jsonp',
				crossDomain:true,
				jsonp:'callback',
				cache:true,
				success:function(data){
					$('#inputTitle').val(data.title)
					$('#inputDoctor').val(data.directors[0].name)
					$('#inputCountry').val(data.countries[0])
					$('#inputPoster').val(data.images.large)
					if(data.languages){
						$('#inputLanguage').val(data.languages)
					}
					$('#inputYear').val(data.year)
					$('#inputCategory').val(data.genres)
					$('#inputSummary').val(data.summary)
				}
				
			})
		} 
		
	})

})
function getCategoryList(){
	var movieCategorieslist=$("#movieCategorieslist").val().split(',')
	var checkbox=$("input[name='movie[category]'")
	for(var i=0;i<checkbox.length;i++){
		checkValidate(movieCategorieslist,checkbox[i].id)
	}
}
function checkValidate(movie,id){
	for(var i=0;i<movie.length;i++){
		if(movie[i]==id){
			$("#"+id).prop('checked',true)
			break
		}
	}
}
