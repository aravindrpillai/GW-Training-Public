/**
 * Configuration :
 *    - codeinspection.properties
 *        * codeinspect.absolute.output.location           : set the projet location
 *        * codeinspect.this.accelerator.relative.location : set the app folder inside the project
 *    - accelerators.codeinspect.util.PropertyReaderUtil
 *        * set
 *  Execution : run the below code to run the process.
 *    - You can specify the files.xml location if you have a different one
 *    - If not specified, system will take the default one which runs for all the files
 *
 */
var filesXMLLocation = "C:/aravind/gw/PolicyCenter1010/modules/configuration/gsrc/test/inspect/files.xml"

CodeInspector.inspect(:filesXMLLocation = null)