<%@ params( content: String, rulesContent : String, filesContent: String) %>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Guidewire Code Inspector</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
	<style>
         h1{ font-size: 30px; color: #fff; text-transform: uppercase; font-weight: 300; text-align: center; margin-bottom: 15px; }
         .tbl-class-details{ background-color: rgba(200,220,0,0.3); border: 1px solid rgba(255,255,255,0.3); }
         .tbl-rule-details{ background-color: rgba(255,255,100,0.3); border: 1px solid rgba(255,255,255,0.3); }
         .tbl-violation-header{ background-color: rgba(255,255,255,0.3); }
         .tbl-violation-content{ max-height:300px; overflow-x:auto; margin-top: 0px; border: 1px solid rgba(255,255,255,0.3); }
         table{ width:100%; table-layout: fixed; }
         th{ padding: 20px 15px; text-align: left; font-weight: 500; font-size: 12px; color: #fff; }
         td{ padding: 15px; text-align: left; vertical-align:middle; font-weight: 300; font-size: 12px; color: #fff; border-bottom: solid 1px rgba(255,255,255,0.1); }
		 @import url(https://fonts.googleapis.com/css?family=Roboto:400,500,300,700);
         body{ background: -webkit-linear-gradient(left, #25c481, #25b7c4); background: linear-gradient(to right, #25c481, #25b7c4); font-family: 'Roboto', sans-serif; }
         section{ margin: 50px; }
         ::-webkit-scrollbar { width: 6px; }
         ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); }
         ::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); }
      </style>
</head>

<body style="cursor:pointer">
	<section>
		<table>
        		<tr>
        			<td width="70%"><h1>Guidewire Code Inspector</h1></td>
        			<td>
        				<h2>
        					<span onClick="togglePages('reports')" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='#fff'"><i id="reports-fa-icon" class="fa fa fa-th-list"></i>&nbsp;Reports</span> &nbsp;|&nbsp;
        					<span onClick="togglePages('rules')" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='#fff'"><i id="rules-fa-icon" class="fa fa-list-alt"></i>&nbsp;Rules </span>&nbsp;|&nbsp;
        					<span onClick="togglePages('files')" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='#fff'"><i id="files-fa-icon" class="fa fa fa-file-text"></i>&nbsp;Files</span>
        				<h2>
        			</td>
        		</tr>
        	</table>

        <div id="report-page-main">
		    ${content}
        </div>
        <div id="rules-page-main">
            ${rulesContent}
        </div>
        <div id="files-page-main">
            ${filesContent}
        </div>
	</section>
</body>


<script>
    var currentOpenViolationTableID = null;
	var currentOpenRuleTableID = null;
	var isCurrentlyHiding = false;

    $("#report-page-main").show();
	$("#rules-page-main").hide();
	$("#files-page-main").hide();

	$(".rules-table").hide();
	$(".file-fa-icon").removeClass('fa-minus-square');
	$(".file-fa-icon").addClass('fa-plus-square');

	$(".violations-table").hide();
	$(".rule-fa-icon").removeClass('fa-minus-square');
	$(".rule-fa-icon").addClass('fa-plus-square');

	var currentFileTypeID = null;
	$(".files-of-filetype").hide();
	$(".filetype-fa-icon").removeClass('fa-minus-square');
	$(".filetype-fa-icon").addClass('fa-plus-square');

	$(".no_violation_filetype").show();



    /**
    * Function to show the violations of each rule
    */
	function showViolationsForRule(ruleID){
		$(".violations-table").hide();
		$(".rule-fa-icon").removeClass('fa-minus-square');
		$(".rule-fa-icon").addClass('fa-plus-square');
		if(currentOpenViolationTableID === ruleID){
			$("#"+ruleID).hide();
			currentOpenViolationTableID = null;
			$("#fa-"+ruleID).removeClass('fa-minus-square');
			$("#fa-"+ruleID).addClass('fa-plus-square');
		}else{
			currentOpenViolationTableID = ruleID;
			$("#"+ruleID).show();
			$("#fa-"+ruleID).removeClass('fa-plus-square');
			$("#fa-"+ruleID).addClass('fa-minus-square');
		}
	}

    /**
    * Function to show thr rules of each page
    */
	function showRulesForFile(fileID){
		$(".rules-table").hide();
		$(".violations-table").hide();
		$(".rule-fa-icon").removeClass('fa-minus-square');
		$(".rule-fa-icon").addClass('fa-plus-square');

		$(".violation-fa-icon").removeClass('fa-minus-square');
		$(".violation-fa-icon").addClass('fa-plus-square');
		if(currentOpenRuleTableID === fileID){
			$("#"+fileID).hide();
			currentOpenRuleTableID = null;
			$("#fa-"+fileID).removeClass('fa-minus-square');
			$("#fa-"+fileID).addClass('fa-plus-square');
		}else{
			currentOpenRuleTableID = fileID;
			$("#"+fileID).show();
			$("#fa-"+fileID).removeClass('fa-plus-square');
			$("#fa-"+fileID).addClass('fa-minus-square');
		}
	}

    /**
    * Function to toggle between the pages
    */
	function togglePages(page){
        $("#report-page-main").hide();
	    $("#rules-page-main").hide();
	    $("#files-page-main").hide();
	    if(page === "files"){
	        $("#files-page-main").show();
	    }
	    else if(page === "rules"){
	        $("#rules-page-main").show();
	    }
	    else{
	        $("#report-page-main").show();
	    }
	}


	/**
    * Function to show thr rules of each page
    */
    function toggleFileTypes(fileTypeID){
        $(".no_violation_filetype").show();
        $(".files-of-filetype").hide();
        $(".filetype-fa-icon").removeClass('fa-minus-square');
        $(".filetype-fa-icon").addClass('fa-plus-square');

        if(currentFileTypeID === fileTypeID){
            $("#filetype_"+fileTypeID).hide();
            currentFileTypeID = null;
            $("#fa-filetype_"+fileTypeID).removeClass('fa-minus-square');
            $("#fa-filetype_"+fileTypeID).addClass('fa-plus-square');
        }else{
            currentFileTypeID = fileTypeID;
            $("#filetype_"+fileTypeID).show();
            $("#fa-filetype_"+fileTypeID).removeClass('fa-plus-square');
            $("#fa-filetype_"+fileTypeID).addClass('fa-minus-square');
        }
	}


    /**
    * Function to show or hide the empty violation list
    */
    function hideNoViolationTypes(){
        if(isCurrentlyHiding){
            $(".no_violation_filetype").show();
            isCurrentlyHiding = false;
        }else{
            $(".no_violation_filetype").hide();
            isCurrentlyHiding = true;
        }
	}

</script>

</html>