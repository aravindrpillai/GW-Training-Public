package training.util.codeinspect.base

uses java.io.File
uses training.util.codeinspect.util.RulesXMLUtil
uses org.apache.log4j.Logger
uses java.io.FileNotFoundException
uses training.util.codeinspect.dto.RuleDTO
uses training.util.codeinspect.util.FileUtil
uses training.util.codeinspect.dto.FileTypeDTO
uses training.util.codeinspect.dto.FileMetadataDTO
uses training.util.codeinspect.constants.FileTypes
uses training.util.codeinspect.util.PropertyReaderUtil


/**
 * author : Aravind R Pillai
 * date : 04 Oct 2022
 * desc : Class to pull the files and create the Metadata DTO list based on the configuration in files.xml
 */
class PrepareFiles {

  static final var _logger = Logger.getLogger(PrepareFiles)
  private var _fileMetadataList = new ArrayList<FileMetadataDTO>()
  private var _rules : List<RuleDTO>

  construct(){
    _rules = RulesXMLUtil.getRules()
  }

  /**
   * Main function to create the metadata
   * @param fileTypeDTOs
   * @param rules
   * @return
   */
  function prepare(fileTypeDTOs : List<FileTypeDTO>) : List<FileMetadataDTO> {
    _logger.info("Starting to prepare metadata for files")
    foreach (fileTypeDTO in fileTypeDTOs index i) {
      switch (fileTypeDTO.FileType) {
        case ENTITY:
          prepareEntityList(fileTypeDTO)
          break
        case TYPELIST:
          prepareTypelistList(fileTypeDTO)
          break
        case GOSU:
          prepareGosuList(fileTypeDTO)
          break
        case RULES:
          prepareRulesList(fileTypeDTO)
          break
        case PCF:
          preparePCFList(fileTypeDTO)
          break
      }
    }
    _logger.info("Metadata created successfully.")
    return _fileMetadataList
  }

  /**
   * Function to prepare metadata for ENTITIES
   * @param fileTypeDTO
   */
  private function prepareEntityList(fileTypeDTO : FileTypeDTO) {
    var entityRootFolder = FileUtil.ConfigurationFolder + PropertyReaderUtil.getProperty("codeinspect.entity.absolute.path")
    if (fileTypeDTO.ReadAllFilesOfThisType) {
      var entitiesPackage = new File(entityRootFolder)
      for (file in entitiesPackage.listFiles()) {
        if (file.File) {
          _fileMetadataList.add(createMetadatObj(file))
        }
      }
    } else {
      foreach (loc in fileTypeDTO.Locations) {
        var entity = new File(entityRootFolder + "/" + loc.Location)
        if (not entity.exists()) {
          if (loc.Location.containsIgnoreCase(".eti") or loc.Location.containsIgnoreCase(".etx")) {
            throw new FileNotFoundException("Entity `" + loc.Location + "` is not found. Please check entity type of files.xml")
          } else {
            entity = new File(entityRootFolder + "/" + loc.Location + ".eti")
            if (not entity.exists()) {
              entity = new File(entityRootFolder + "/" + loc.Location + ".etx")
              if (not entity.exists()) {
                throw new FileNotFoundException("Entity `" + loc.Location + "` is not found. Please check entity type of files.xml")
              }
            }
          }
        }
        if (entity.File) {
          _fileMetadataList.add(createMetadatObj(entity))
        } else {
          throw new FileNotFoundException("Entity `" + loc.Location + "` is not found. Please check entity type of files.xml")
        }
      }
    }
  }

  /**
   * Function to prepare metadata for TYPELISTS
   * @param fileTypeDTO
   */
  private function prepareTypelistList(fileTypeDTO : FileTypeDTO) {
    var entityRootFolder = FileUtil.ConfigurationFolder + PropertyReaderUtil.getProperty("codeinspect.typelist.absolute.path")
    if (fileTypeDTO.ReadAllFilesOfThisType) {
      var entitiesPackage = new File(entityRootFolder)
      for (file in entitiesPackage.listFiles()) {
        if (file.File) {
          _fileMetadataList.add(createMetadatObj(file))
        }
      }
    } else {
      foreach (loc in fileTypeDTO.Locations) {
        var tl = new File(entityRootFolder + "/" + loc.Location)
        if (not tl.exists()) {
          if (loc.Location.containsIgnoreCase(".tti") or loc.Location.containsIgnoreCase(".ttx")) {
            throw new FileNotFoundException("Typelist `" + loc.Location + "` is not found. Please check typelist type of files.xml")
          } else {
            tl = new File(entityRootFolder + "/" + loc.Location + ".tti")
            if (not tl.exists()) {
              tl = new File(entityRootFolder + "/" + loc.Location + ".ttx")
              if (not tl.exists()) {
                throw new FileNotFoundException("Typelist `" + loc.Location + "` is not found. Please check typelist type of files.xml")
              }
            }
          }
        }
        if (tl.File) {
          _fileMetadataList.add(createMetadatObj(tl))
        } else {
          throw new FileNotFoundException("Typelist `" + loc.Location + "` is not found. Please check typelist type of files.xml")
        }
      }
    }
  }

  /**
   * Function to prepare metadata for GOSU Codes
   * @param fileTypeDTO
   */
  private function prepareGosuList(fileTypeDTO : FileTypeDTO) {
    var gosuExtensions = {"gs", "gsx"}

    if (fileTypeDTO.ReadAllFilesOfThisType) {
      readFilesFromFolderAndSubFolder(FileUtil.ConfigurationFolder + "/gsrc", gosuExtensions)
      readFilesFromFolderAndSubFolder(FileUtil.ConfigurationFolder + "/gtest", gosuExtensions)
    } else {
      var path : String
      foreach (loc in fileTypeDTO.Locations) {
        if (not loc.IsFolder and not gosuExtensions.hasMatch(\elt1 -> loc.Location.containsIgnoreCase("." + elt1))) {
          var fileNotFound = true
          foreach (ext in gosuExtensions) {
            var f = new File(FileUtil.ConfigurationFolder + "/" + loc.Location + "." + ext)
            if (f.File) {
              _fileMetadataList.add(createMetadatObj(f))
              fileNotFound = false
              break
            }
          }
          if (fileNotFound) {
            throw new FileNotFoundException("File " + loc.Location + " not found. Please see files.xml under gosu tag")
          }
        } else {
          path = FileUtil.ConfigurationFolder + "/" + loc.Location
          readFilesFromFolderAndSubFolder(path, gosuExtensions)
        }
      }
    }
  }

  /**
   * Function to prepare metadata for RULES
   * @param fileTypeDTO
   */
  private function prepareRulesList(fileTypeDTO : FileTypeDTO) {
    var rulesRootFolder = FileUtil.ConfigurationFolder + PropertyReaderUtil.getProperty("codeinspect.rules.absolute.path")
    if (fileTypeDTO.ReadAllFilesOfThisType) {
      readFilesFromFolderAndSubFolder(rulesRootFolder, {"gr"})
    } else {
      var rootLoc = ""
      foreach (loc in fileTypeDTO.Locations) {
        if (loc.ReadAllRulesUnderThis) {
          rootLoc = rulesRootFolder + "/" + loc.RuleCategory
          readFilesFromFolderAndSubFolder(rootLoc, {"gr"})
        } else {
          rootLoc = rulesRootFolder + "/" + loc.RuleCategory
          var searchName = loc.Location.replaceAll(" ", "")
          var file = FileUtil.findFile(rootLoc, searchName)
          var folder = FileUtil.findFolder(rootLoc, searchName)
          if (file != null) {
            readFilesFromFolderAndSubFolder(file, {"gr"})
          }
          if (folder != null) {
            readFilesFromFolderAndSubFolder(folder, {"gr"})
          }
        }
      }
    }
  }

  /**
   * Function to prepare metadata for PCFs
   * @param fileTypeDTO
   */
  private function preparePCFList(fileTypeDTO : FileTypeDTO) {
    var entityRootFolder = FileUtil.ConfigurationFolder + PropertyReaderUtil.getProperty("codeinspect.pcf.absolute.path")
    if (fileTypeDTO.ReadAllFilesOfThisType) {
      readFilesFromFolderAndSubFolder(entityRootFolder, {"pcf"})
    } else {
      foreach (loc in fileTypeDTO.Locations) {
        if (not loc.IsFolder and not loc.Location.containsIgnoreCase(".pcf")) {
          loc.Location = loc.Location + ".pcf"
        }
        readFilesFromFolderAndSubFolder(entityRootFolder + "/" + loc.Location, {"pcf"})
      }
    }
  }

  /**
   * Function to create the metadata object by using the file
   * @param fileTypeDTO
   */
  private function createMetadatObj(file : File) : FileMetadataDTO {
    var fileMetaDataObj = new FileMetadataDTO()
    fileMetaDataObj.File = file
    fileMetaDataObj.FileName = file.Name.replaceFirst("[.][^.]+$", "")
    fileMetaDataObj.Extension = file.Extension
    fileMetaDataObj.FileType = FileUtil.getFileType(file)
    fileMetaDataObj.Rules = findRulesForThisFile(fileMetaDataObj.FileType, file.AbsolutePath)
    return fileMetaDataObj
  }

  /**
   * Function to read all files and folders from a directory
   * @param fileTypeDTO
   */
  private function readFilesFromFolderAndSubFolder(location : String, extensions : List<String>) {
    var file = new File(location)
    if (file.File and extensions.contains(file.Extension)) {
      _fileMetadataList.add(createMetadatObj(file))
    } else if (file.Directory) {
      for (f in file.listFiles()) {
        if (f.File and extensions.contains(f.Extension)) {
          _fileMetadataList.add(createMetadatObj(f))
        } else if (f.Directory) {
          readFilesFromFolderAndSubFolder(f.getAbsolutePath(), extensions)
        }
      }
    } else {
      throw new RuntimeException("Invalid file under package - " + location)
    }
  }

  /**
   * Function to get the roles applicable for this file
   * @param fileType
   * @param fileName
   * @return
   */
  private function findRulesForThisFile(fileType : FileTypes, fileName: String) : List<RuleDTO>{
    var applicableRules = _rules.where(\rule -> rule.RuleFor.contains(fileType))
    if(not applicableRules.HasElements){
      _logger.debug("No rule found for file type "+ fileType+" | Full File Name : "+fileName)
    }
    return applicableRules
  }
}