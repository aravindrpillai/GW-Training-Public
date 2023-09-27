<%
uses training.util.codeinspect.dto.RuleDTO
uses training.util.codeinspect.dto.ViolationsDTO
%>
<%@ params( rule : RuleDTO, violations:Set<ViolationsDTO>, fileNo: Integer, ruleNo : Integer) %>

<!-- START OF RULE CONTENT ${ruleNo} -->
<div>
    <div class="tbl-rule-details" onClick="showViolationsForRule('${fileNo+"_"+ruleNo}')">
        <table style="margin-left:30px">
            <thead>
                <tr>
                    <th width="30%"><i id="${"fa-"+fileNo+"_"+ruleNo}" class="rule-fa-icon fa fa-plus-square"></i> Rule Name : ${rule.RuleName}</th>
                    <th width="10%">Severity : ${rule.Severity}</th>
                    <th width="60%">Description : ${rule.RuleDescription}</th>
                </tr>
            </thead>
        </table>
    </div>
    <div class="violations-table" id="${fileNo+"_"+ruleNo}">
        <div class="tbl-violation-header">
            <table style="margin-left:60px">
                <thead>
                    <tr>
                        <th width="10%">Line Number</th>
                        <th width="90%">Code</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="tbl-violation-content">
            <table style="margin-left:60px; width:95%;">
                <tbody>
                    <% for(violation in violations) {%>
                    ${ CodeInspectViolationSection.renderToString(violation) }
                    <% } %>
                </tbody>
            </table>
        </div>
    </div>
</div>
<!-- END OF RULE CONTENT ${ruleNo} -->