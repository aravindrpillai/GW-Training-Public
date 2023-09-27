<%
uses training.util.codeinspect.util.RulesXMLUtil
%>

<div>
    <div class="tbl-violation-header">
      <table>
        <thead>
          <tr> <th width="15%">Rule Name</th> <th width="5%">Severity</th> <th width="5%">Disabled</th> <th width="15%">Rule Class</th> <th width="15%">Rule For</th> <th width="45%">Description</th> </tr>
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
          <tr> <td width="15%">${rule.RuleName}</td> <td width="5%">${rule.Severity}</td> <td width="5%">${rule.Disabled?"Yes":"No"}</td> <td width="15%">${rule.ClassName}</td> <td width="15%">${rule.RuleFor?.toString()}</td> <td width="45%">${rule.RuleDescription}</td> </tr>
          <% } %>
        </tbody>
      </table>
    </div>
</div>