<%@ params( imports: List<String>, code : List<String> ) %>

<% for (import in imports) { %>
${import}
<% } %>

var output = new ArrayList<Object>()
<% for (codeLine in code) { %>
${codeLine.replace("print", "output.add")}
<% } %>

return output

