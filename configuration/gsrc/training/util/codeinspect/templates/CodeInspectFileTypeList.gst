<%
uses training.util.codeinspect.constants.FileTypes
uses training.util.codeinspect.dto.FileMetadataDTO
uses training.util.codeinspect.util.FileUtil
%>
<%@ params( fileTypeMap: HashMap<FileTypes, List<FileMetadataDTO>> ) %>

<% for(fileType in fileTypeMap.Keys index i) { %>
<%
var fileMetaDataList = fileTypeMap.get(fileType)
var totalViolations = 0
foreach(f in fileMetaDataList){
    if(f.Violations != null ){
        totalViolations += f.Violations.Count
    }
}
%>
<div>
    <div class="tbl-class-details" onClick="toggleFileTypes(${i})">
        <table>
            <thead>
                <tr>
                    <th width="30%"><i id="${"fa-filetype_"+i}" class="filetype-fa-icon fa fa-plus-square"></i> File Type: ${fileType}</th>
                    <th width="10%">Files Count : ${fileMetaDataList.Count}</th>
                    <th width="10%">Violation Count : ${totalViolations}</th>
                </tr>
            </thead>
        </table>
    </div>
    <div class="files-of-filetype" id="${"filetype_"+i}">
        <div class="tbl-violation-header">
            <table style="margin-left:60px">
                <thead>
                    <tr>
                        <th width="60%">FileName</th>
                        <th onClick="hideNoViolationTypes()" width="10%">Violation Count &nbsp;&nbsp;<i class="fa fa-eye"></i></th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="tbl-violation-content">
            <table style="margin-left:60px;">
                <tbody>
                    <% for(metadata in fileMetaDataList) { %>
                    <tr class="${metadata.Violations?.Count == 0 ? "no_violation_filetype" : ""}"><th width="60%">${metadata.File.AbsolutePath.replaceAll("\\\\","/").remove(FileUtil.ConfigurationFolder+"/").replaceAll("/", ".")}</th><th width="10%">${metadata.Violations?.Count}</th></tr>
                    <% } %>
                </tbody>
            </table>
        </div>
    </div>
</div>
<% } %>