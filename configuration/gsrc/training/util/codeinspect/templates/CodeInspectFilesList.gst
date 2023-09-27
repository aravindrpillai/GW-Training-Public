<%
uses training.util.codeinspect.util.RulesXMLUtil
%>
<div id="rules-section">
  <div style="cursor:pointer">
    <div class="tbl-violation-header">
      <table>
        <thead>
          <tr> <th width="15%">FileName</th> <th width="5%">Violation Count</th> <th width="5%">Disabled</th> <th width="15%">Rule Class</th> <th width="60%">Description</th> </tr>
        </thead>
      </table>
    </div>
    <div class="tbl-violation-content">
      <table>
        <tbody>
        <%
        var rules = RulesXMLUtil.getRules(false)
        for(rule in rules){
        %>
          <tr> <td width="15%">${rule.RuleName}</td> <td width="5%">${rule.Severity}</td> <td width="5%">${rule.Disabled?"Yes":"No"}</td> <td width="15%">${rule.ClassName}</td> <td width="60%">${rule.RuleDescription}</td> </tr>
          <% } %>
        </tbody>
      </table>
    </div>
  </div>
</div>