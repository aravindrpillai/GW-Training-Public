/*
File : typecodemapper.xml

<typecodemapping>
  <namespacelist>
    <namespace name="name_space_for_policy_status_prometrix"/>
    <namespace name="name_space_for_policy_status_lexisnexis"/>
  </namespacelist>

  <typelist name="PolicyStatus">
    <mapping typecode="DRAFT" namespace="name_space_for_policy_status_lexisnexis" alias="Lexis_DRAFT"/>
    <mapping typecode="BOUND" namespace="name_space_for_policy_status_lexisnexis" alias="Lexis_BOUND"/>

    <mapping typecode="DRAFT" namespace="name_space_for_policy_status_prometrix" alias="Prometrix_DRAFT"/>
    <mapping typecode="BOUND" namespace="name_space_for_policy_status_prometrix" alias="Prometrix_BOUND"/>
  </typelist>
</typecodemapping>
 */

var tcMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()

//Below code wil return --> Prometrix_DRAFT
var prometrixCode = tcMapper.getAliasByInternalCode("PolicyStatus", "name_space_for_policy_status_prometrix", "draft")

//Below code wil return --> Lexis_DRAFT
var lexisNexisCode = tcMapper.getAliasByInternalCode("PolicyStatus", "name_space_for_policy_status_lexisnexis", "draft")

