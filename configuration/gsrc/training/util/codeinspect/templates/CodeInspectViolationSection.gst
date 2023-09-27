<%
uses training.util.codeinspect.dto.ViolationsDTO
%>
<%@ params( violation : ViolationsDTO) %>
<tr>
    <td width="10%"> ${violation.LineNumber} </td>
    <td width="90%">${violation.Line}</td>
</tr>