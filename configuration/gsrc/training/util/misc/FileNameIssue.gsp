uses java.lang.*
uses java.io.*

/**
 * author : Aravind R Pillai
 * date : 28 May 2023
 * Requirement : Database contingency test fails when the entity file name length is more than 25 chars.
 * Desc : Code to pull out all the entity/typelist files with name length >  filen_name_size_limit
 * This also lists out the dependandicies of the of the file.
 */
//Specify the max allowed file name length
var filen_name_size_limit = 23

//Confiure the configuration path loaction
var configuration_folder_path = "C:/aravind/gw/PolicyCenter1010/modules/configuration/"

//Specify the entity and typelist folder loaction
var typelist_folder = configuration_folder_path+"config/extensions/typelist/"
var entity_folder = configuration_folder_path+"config/extensions/entity"

//Specify the folders where we need to run the test
var interestedFolders = {
    configuration_folder_path+"config/extensions",
    configuration_folder_path+"config/displaynames",
    configuration_folder_path+"config/web",
    configuration_folder_path+"config/rules",
    configuration_folder_path+"gsrc"
}

var retList = new ArrayList<String>()
print("starting.........")
var filesWithIssue = listPullFilesWithLengthIssue()
print(filesWithIssue)
var containedWords : List<String>
foreach(interestedFolder in interestedFolders){
  listFiles(new File(interestedFolder))
  foreach(file in retList){
    containedWords = doesFileContains(filesWithIssue, file)
    if(containedWords.Count > 0){
      print(file +" :-> "+ containedWords)
    }
  }
}
print("done.........")


/**
 * pull all files with name length more than the specified length
 * @return
 */
function listPullFilesWithLengthIssue() : Set<String>{

  var affected_typelists = new ArrayList<String>()
  var typelist_files = new File(typelist_folder)
  var t_file_name = ""
  foreach(f in typelist_files.listFiles()){
    t_file_name = f.Name.split(".tt")[0]
    if(t_file_name.length() > filen_name_size_limit){
      affected_typelists.add(t_file_name)
    }
  }

  var affected_entities = new ArrayList<String>()
  var entity_files = new File(entity_folder)
  var e_file_name = ""
  foreach(f in entity_files.listFiles()){
    e_file_name = f.Name.split(".et")[0]
    if(e_file_name.length() > filen_name_size_limit){
      affected_entities.add(e_file_name)
    }
  }
  return affected_entities.union(affected_typelists)
}

/**
 * Function to list all files
 * @param folder
 */
function listFiles(folder : File){
  var files = folder.listFiles()
  for(file in files){
    //print(file +" --> "+file.Directory)
    if(file.Directory){
      listFiles(file)
    }else{
      retList.add(file.AbsolutePath)
    }
  }
}

/**
 * function to check the usage of a file name
 * @param searchStringList
 * @param filePath
 * @return
 */
function doesFileContains(searchStringList:Set<String>, filePath :  String) : List<String> {
  var foundStringList = new ArrayList<String>()
  try {
    var reader = new BufferedReader(new FileReader(filePath))
    var line = reader.readLine()
    while (line != null) {
      for (searchString in searchStringList) {
        if(foundStringList.contains(searchString)){
          continue
        }
        if (line?.contains(searchString)) {
          var sp = line.split(searchString)
          var p1 = sp[0]
          var isCommented = p1.contains("<!--") or p1.contains("//")
          try {
            if (!isCommented and !Character.isLetter(p1.charAt(p1.length() - 1)) and !Character.isLetter(sp[1].charAt(0))) {
              foundStringList.add(searchString)
            }
          }catch(e){
            e.printStackTrace()
          }
        }
      }
      line = reader.readLine()
    }
    reader.close()
  } catch (e : IOException) {
    e.printStackTrace()
  }
  return foundStringList
}
