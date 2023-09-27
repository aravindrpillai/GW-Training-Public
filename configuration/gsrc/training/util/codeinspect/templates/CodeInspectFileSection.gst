<%
uses training.util.codeinspect.dto.FileMetadataDTO
uses training.util.codeinspect.util.FileUtil
%>
<%@ params( fileMetadata:FileMetadataDTO, ruleContent: String, fileNo : Integer ) %>

<!-- START OF FILE CONTENT ${fileNo} -->
<div style="cursor:pointer">
	<div class="tbl-class-details" onClick="showRulesForFile('${"file_"+fileNo}')">
		<table>
			<thead>
			    <tr>
                    <th width="60%"><i id="${"fa-file_"+fileNo}" class="violation-fa-icon fa fa-plus-square"></i> File : ${fileMetadata.File.AbsolutePath.replaceAll("\\\\","/").remove(FileUtil.ConfigurationFolder+"/").replaceAll("/", ".")}</th>
                    <th width="20%">${fileMetadata.FileType.Code}</th>
                    <th width="20%">Violation Count : ${fileMetadata.Violations.Count}</th>
                </tr>
			</thead>
		</table>
	</div>
	<div class="rules-table" id="${"file_"+fileNo}">

		${ruleContent}

	</div>
</div>
<!-- END OF FILE CONTENT ${fileNo} -->
