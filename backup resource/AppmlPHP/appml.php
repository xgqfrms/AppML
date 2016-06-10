<?php
//error_reporting(E_ALL);
//ini_set('display_errors','1');
//Appml v1.000 - Created by Refsnes Data for W3Schools. Please don't remove this line.
session_start();
ob_start();
header("Cache-Control: no-cache");
header("Pragma: no-cache");
header("Expires: ".gmdate("D, d M Y H:i:s",time()+(-1*60))." GMT");
header("Content-type: text/xml; charset=UTF-8");
$fNo=array();
$executeSQL=array();
$updItem=array();
$names=array();
$values=array();
$fieldlist=array();
$valuelist=array();
$typeslist=array();
$ctrlItemName=array();$ctrlItemMin=array();$ctrlItemMax=array();$ctrlItemRequired=array();
$pos=array();
$params=array();
$fName=array();$fType=array();$fValue=array();$fNodeName=array();
$dbType="MYSQL";
$listSql="";$formSql="";$reportSql="";$defaultSql="";
$txtWhere="";
$executeSQLcount=0;
$fromRec=0;
$toRec=0;
$displayType="";
$dataSource="";
$dataOut="";
$ctrlItemCounter=0;
$maxRecords=0;
$maxLines=0;
$recPos=1;
$keyCounter=0;
$updItemcounter=0;
$mainTable="";
$userName="";$pwd="";
$paramCount=0;
//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
$txtRequest=app_readRequest();
if ($txtRequest=="") {exit();}
$modLocalData=app_loadTextFromFile("appml_config.php");
$modDateFormat=app_getElementValue($modLocalData, "dateformat");
if ($modDateFormat == "") {$modDateFormat="YYYY-MM-DD";}
$txt=app_getElementValue($txtRequest, "login");
if ($txt != "") {
  $userName=app_getElementValue($txt, "f1");
  $pwd=app_getElementValue($txt, "f2");
  if ($userName == "" || $pwd == "") {app_error("APPML_ERR_USN_OR_PWD_REQ");}
  $nn=app_setSession("","");
  $sql="SELECT AppmlRoles.Name FROM ((AppmlUserRoles";
  $sql.=" LEFT JOIN AppmlUsers ON AppmlUserRoles.UserID=AppmlUsers.UserID)";
  $sql.=" LEFT JOIN AppmlRoles ON AppmlUserRoles.RoleID=AppmlRoles.RoleID)";
  $sql.=" WHERE AppmlUsers.Email=@0 AND AppmlUsers.Pass=@1;";
  $dbConnection=app_getDbConnection("appmlsecurity",$modLocalData);
  $paramCount=2;
  $params[1]=$userName;
  $params[2]=$pwd;
  $dbRecordset=app_dbRead($dbConnection,$sql,$paramCount,$params);
  $userAccess="";
  $totalCounter=app_dbRowcount($dbRecordset);
  if ($totalCounter==0) {app_error("APPML_ERR_NOT_AUTHORIZED");}
  $row=$dbRecordset->fetch_array(MYSQLI_BOTH);
  $nn=0;  
  while ($nn < $totalCounter) {
    $nn++;
    if ($userAccess != "") {$userAccess.=",";}
    $userAccess.=$row[0];
    $row=$dbRecordset->fetch_array(MYSQLI_BOTH);
  }  
  if ($userAccess != "") {$nn=app_setSession($userName,$userAccess);}
  $dbRecordset->close;
  exit();
}
$txtAppName=app_getElementValue($txtRequest, "appname");
if ($txtAppName == "") {app_error("APPML_ERR_APPNAME_REQ");}
$action=app_getElementValue($txtRequest, "action");
if ($action == "") {app_error("APPML_ERR_ACTION_REQ");}
$keyValue=app_getElementValue($txtRequest, "appmlid");
$cc=app_loadTextFromFile($txtAppName);
$txtModel=app_getElement($cc,"appml");
if ($txtModel == "") {app_error("APPML_ERR_MODEL_REQ: ".$txtAppName);}
$txt=app_getAttribute($txtModel, "dateformat");
if ($txt != "") {$modDateFormat=$txt;}
$security=app_getAttribute($txtModel, "security");
if (getUserAccess($security) != "OK") {app_error("APPML_ERR_NOT_AUTHORIZED");}
$txt=app_GetElement($txtModel, "datasource");
$x=app_getElementValue($txt, "database");
if ($x != "") {
  $dataSource="database";
  $cc=app_getElementValue($x, "connection");
  $dbConnection=app_getDbConnection($cc,$modLocalData);
  $mainTable=app_getElementValue($x, "maintable");
  $txtWhere=app_getElementValue($txt, "where");
  $items=app_getElementArray($x, "sql");
  $l=app_arrayLength($items);
  for ($i=1; $i<=$l; $i++) {
    $y=app_getElementValue($items[$i], "sql");
    $cc=app_getAttribute($items[$i], "type");
    if ($cc == "list") {$listSql=$y;}
    if ($cc == "form") {$formSql=$y;}
    if ($cc == "report") {$reportSql=$y;}
    if ($cc == "") {$defaultSql=$y;}
  }
  $keyField=app_getElementValue($x, "keyfield");
  if ($keyField!="") {
    $keyCounter=1;
    $keyType=app_getAttribute(app_getElement($x, "keyfield"), "type");
    if ($keyType=="") {$keyType="number";}
  }
  $items=app_getElementArray($x, "execute");
  $l=app_arrayLength($items);
  for ($i=1; $i<=$l; $i++) {
    $executeSQLcount++;$executeSQL[$executeSQLcount]=app_getElementValue($items[$i], "execute");
  }
  if ($executeSQLcount>0) {$nn=app_executeSQL($dbConnection,$executeSQL,$executeSQLcount);}
}
else {
  $x=app_getElement($txt, "xmlfile");
  if ($x != "") {$dataSource="xmlfile";}
  else {
    $x=app_GetElement($txt, "csvfile");
    if ($x != "") {
      $dataSource="csvfile";}
  }
  if ($x != "") {
    $filePath=app_getAttribute($x, "src");
    $fCount=0;
    $fPath=app_getElementValue($x, "record");
    $arr=app_getElementArray($x, "item");
    $fCount=app_arrayLength($arr);
    for ($i=1; $i<=$fCount; $i++) {
      $fName[$i]=app_getElementValue($arr[$i], "name");
      $fType[$i]=app_getElementValue($arr[$i], "type");
      if ($fType[$i] == "") {$fType[$i]="text";}
      $fNodeName[$i]=app_getElementValue($arr[$i], "nodename");
      $fNo[$i]=app_getElementValue($arr[$i], "index");
    }
  }
}
if ($dataSource == "") {app_error("APPML_ERR_DATASOURCE_REQ");}
if ($action == "GET") {
  $displayType=app_getElementValue($txtRequest, "displaytype");
  if ($displayType == "") {$displayType="list";}
  $navType=app_getElementValue($txtRequest, "navigate");
  if ($navType=="") {$navType="first";}
  $txt=app_getElementValue($txtRequest, "maxrecords");
  if ($txt != "") {$maxRecords=intval($txt);}
  $txt=app_getElementValue($txtRequest, "rowsperpage");
  if ($txt != "") {$maxLines=intval($txt);}
  $txt=app_getElementValue($txtRequest, "recpos");
  if ($txt != "") {$recPos=intval($txt);}
  $requestQuery=app_getElement($txtRequest, "filters");
  if ($displayType == "list") {$sql=$listSql;}
  if ($displayType == "form") {
    $sql=$formSql;
    if ($sql == "") {$sql=$listSql;}
  }
  if ($displayType == "report") {
    $sql=$reportSql;
    if ($sql == "") {$sql=$listSql;}
  }
  if ($sql=="") {$sql=$defaultSql;}
  if ($displayType == "form") {$maxLines=1;}
  $dataOut="<appmldata>";
  if ($dataSource == "database") {
    if ($sql != "") {
      if ($keyValue != "") {
        if ($keyCounter == 0) {app_error("APPML_ERR_KEYFIELD_REQ");}
        if ($mainTable == "") {app_error("APPML_ERR_MAINTABLE_REQ");}
        if ($keyValue == "NULL") {$keyValue="-1";}
        $sql.=" WHERE ".add_brackets($mainTable).".".add_brackets($keyField)."=@0;";
		$paramCount=1;
        $params[1]=$keyValue;
        $dbRecordset=app_dbRead($dbConnection, $sql, $paramCount, $params);
      }
      else {
        $txtFilters=app_getElement($txtModel, "filters");
        $cc=appml_GetQueryWhere($txtWhere,$txtFilters,$requestQuery,&$paramCount,&$params);
        if ($cc != "") {$sql.=" WHERE ".$cc;}
        $cc=appml_GetOrderby($txtFilters,$requestQuery);
        if ($cc != "") {$sql.=$cc;}
        $dbRecordset=app_dbRead($dbConnection, $sql, $paramCount, $params);
      }
      $totalCounter=app_dbRowcount($dbRecordset);
      if ($totalCounter>1) {
          if ($keyValue!="") {app_error("APPML_ERR_INVALID_KEY");}
      }
      $fCount=$dbRecordset->field_count;
      $i=0;
      while ($x = $dbRecordset->fetch_field()) {
          $i++;
          $fType[$i]=app_getType($x->type);
          $fName[$i]=$x->name;
          $fValue[$i]="";
      }
      if ($navType == "new") {
          $totalCounter=0;
          $dataOut.=app_getRecordAsXML("<keyvalue></keyvalue>",$fName,$fType,$fValue,$fCount);
      }
      $fromRec=app_setFromPosition($recPos,$navType,$maxLines,$totalCounter);
      $toRec=app_setToPosition($fromRec,$navType,$maxLines,$totalCounter);
      $row=$dbRecordset->fetch_array(MYSQLI_BOTH);
      $nn=0;       
      while ($nn < $totalCounter) {
        $nn++;
        if ($nn >= $fromRec && $nn <= $toRec) {
          $i=count($row)/2;
          for ($j=1; $j<=$i; $j++) {
             $txt=$row[$j-1];
             if ($fType[$j]=="date") {$txt=app_formatDate($txt, $modDateFormat);}
             $fValue[$j]=$txt;
             if ($fName[$j]==$keyField) {$cc=$fValue[$j];}
          }
          $keys="<keyvalue>".$cc."</keyvalue>\r\n";
          $dataOut.=app_getRecordAsXML($keys, $fName, $fType, $fValue, $fCount);
        }
        $row=$dbRecordset->fetch_array(MYSQLI_BOTH);
      }
      $dbRecordset->close();
    }
  }
  if ($dataSource == "xmlfile" || $dataSource == "csvfile") {
    if ($dataSource == "csvfile") {
      $i=0;
      try {
        $lines=file($filePath);
        foreach ($lines as $value) {
          $i++;
          $arr[$i] = $value;
          }
      }
      catch (Exception $e) {
        app_error("APPML_ERR_ERROR: ".$e);
      }
      $totalCounter=$i;
    }
    else {
      $xmldoc=app_loadTextFromFile($filePath);
      $arr=app_getElementArray($xmldoc, $fPath);
      $totalCounter=app_arrayLength($arr);
    }
    $fromRec=app_setFromPosition($recPos,$navType,$maxLines,$totalCounter);
    $toRec=app_setToPosition($fromRec,$navType,$maxLines,$totalCounter);
    if ($keyValue != "") {
      $i=intval($keyValue);
      $fromRec=$i;
      $toRec=$i;
    }
    for ($i=$fromRec; $i<=$toRec; $i++) {
      for ($j=1; $j<=$fCount; $j++) {
        if ($dataSource == "csvfile") {
          $startpos=1;
          for ($k=1; $k<=$fNo[$j] + 1; $k++) {
            $pos[$k]=_instr($startpos,$arr[$i],",",0);
            $startpos=$pos[$k] + 1;
          }
          if ($fNo[$j] == 1) {
            $lastpos=0;}
          else {
            $lastpos=$pos[$fNo[$j]-1];
          }
          $thispos=$pos[$fNo[$j]];
          if ($thispos < 1) {
            $cc="";}
          else {$cc=substr($arr[$i],$lastpos,$thispos-$lastpos-1);
          }
        }
        else {
          $cc=app_getElementValue($arr[$i], $fNodeName[$j]);
        }
        $fValue[$j]=$cc;
      }
      $dataOut.=app_getRecordAsXML("<keyvalue>".$i."</keyvalue>", $fName, $fType, $fValue, $fCount);
    }
  }
  $dataOut.="</appmldata>";
  echo "<"."?xml version='1.0' encoding='UTF-8'?".">";
  echo "<htmllist>\r\n";
  echo "<user>".app_getSession("appmluser")."</user>\r\n";
  echo "<recpos>".$fromRec."</recpos>\r\n";
  echo "<fromrec>".$fromRec."</fromrec>\r\n";
  echo "<torec>".$toRec."</torec>\r\n";
  echo "<reccounter>".intval($toRec-$fromRec + 1)."</reccounter>\r\n";
  echo "<totalreccounter>".$totalCounter."</totalreccounter>\r\n";
  echo "<maxrecords>".$maxRecords."</maxrecords>\r\n";
  echo "<dataout><![CDATA[".$dataOut."]]></dataout>\r\n";
  echo "<dateformat>".$modDateFormat."</dateformat>\r\n";
  echo "<appmlmodel>".$txtModel."</appmlmodel>\r\n";
  echo "</htmllist>";
  exit();
}
if ($action != "UPDATE" and $action != "ADD" and $action != "DELETE") {app_error("APPML_ERR_ILLEGAL_ACTION: ".$action);}
$txt=app_getElement($txtModel, "update");
if ($txt == "") {app_error("APPML_ERR_ILLEGAL_ACTION: ".$action);}
$security=app_getAttribute($txt, "security");
if (getUserAccess($security) <> "OK") {app_error("APPML_ERR_NOT_AUTHORIZED");}		
if ($action == "DELETE") {
  if (strtoupper(app_getAttribute($txt, "delete")) == "FALSE") {app_error("APPML_ERR_ILLEGAL_ACTION: "."DELETE");}
  $x=app_dbDelete($dbConnection,$mainTable,$keyField,$keyValue);
  $echo ($x." APPML_MESSAGE_RECORD_DELETED");
  exit();
}
if ($action == "ADD") {
  if (strtoupper(app_getAttribute($txt, "add")) == "FALSE") {app_error("APPML_ERR_ILLEGAL_ACTION: "."INSERT");}
}
$items=app_getElementArray($txt, "item");
$updItemcounter=app_arrayLength($items);
for ($i=1; $i<=$updItemcounter; $i++) {
  $updItem[$i]=app_getElementValue($items[$i], "name");
}
$fieldCounter=0;
$txt=app_getElement($txtRequest, "record");
if ($txt != "") {
  $items=app_getElementArray($txt, "item");
  $l=app_arrayLength($items);
  for ($i=1; $i<=$l; $i++) {
    $fieldCounter++;
    $names[$fieldCounter]=app_getElementValue($items[$i], "name");
    $values[$fieldCounter]=app_getElementValue($items[$i], "value");
    $types[$fieldCounter]=app_getElementValue($items[$i],"type");
  }
}
$ctrlItemCounter=0;
$txt=app_GetElement($txtModel, "datamodel");
if ($txt != "") {
  $arr=app_getElementArray($txt, "item");
  $ctrlItemCounter=app_arrayLength($arr);
  for ($i=1; $i<=$ctrlItemCounter; $i++) {
    $ctrlItemName[$i]=strtolower(app_getAttribute($arr[$i], "name"));
    if ($ctrlItemName[$i] == "") {app_error("APPML_ERR_DATAMODEL");}
    $ctrlItemMin[$i]=app_GetElement($arr[$i], "min");
    $ctrlItemMax[$i]=app_GetElement($arr[$i], "max");
    $ctrlItemRequired[$i]=1;
  }
}
for ($j=1; $j<=$fieldCounter; $j++) {
  if (strtolower($names[$j]) != strtolower($updItem[$j])) {app_error("APPML_ERR_DATAMODEL");}
  if (trim($values[$j]) == "") {
    $values[$j]="";  // DBNULL
  }
  else {
    if ($types[$j]="number") {
      $decsep=app_getSysDecSep();
      $values[$j]=str_replace(",",$decsep,$values[$j]);
      $values[$j]=str_replace(".",$decsep,$values[$j]);
    }
  }
}
for ($i=1; $i<=$ctrlItemCounter; $i++) {
  for ($j=1; $j<=$fieldCounter; $j++) {
    if ($names[$j] == $ctrlItemName[$i]) {
      if ($ctrlItemMin[$i] != "") {
        $x=$values[$j];
        $y=$ctrlItemMin[$i];
        if (is_numeric($x)) {$x=intval($x);}
        if (is_numeric($y)) {$y=intval($y);}
        if (app_isDate($x)) {$x=app_cDate($x);}
        if (app_isDate(app_reformatDate($y,$modDateFormat))) {$y=app_cDate(app_reformatDate($y,$modDateFormat));}
        if ($x < $y) {app_error("APPML_ERR_INPUT_MIN: ".$names[$j].",".$ctrlItemMin[$i]);}
      }
      if ($ctrlItemMax[$i] != "") {
        $x=$values[$j];
        $y=$ctrlItemMax[$i];
        if (is_numeric($x)) {$x=intval($x);}
        if (is_numeric($y)) {$y=intval($y);}
        if (app_isDate($x)) {$x=app_cDate($x);}
        if (app_isDate(app_reformatDate($y,$modDateFormat))) {$y=app_cDate(app_reformatDate($y,$modDateFormat));}
        if ($x > $y) {app_error("APPML_ERR_INPUT_MAX: ".$names[$j].",".$ctrlItemMax[$i]);}
      }
      if ($ctrlItemRequired[$i] == 1) {
        $x=$values[$j];
        if ($x == "") {app_error("APPML_ERR_INPUT_REQUIRED: ".$names[$j]);}
      }
    }
  }
}
if ($action == "ADD") {
  $nn=app_dbAddNew($dbConnection,$mainTable,$fieldCounter,$names,$values,$types);
  echo $nn." APPML_MESSAGE_RECORD_UPDATED";
  exit();
}
$sql="SELECT ";
for ($i=1; $i<=$fieldCounter; $i++) {
  if ($i > 1) {$sql.=",";}
  $sql.=add_brackets($names[$i]);
}
$sql.=" from ".add_brackets($mainTable)." WHERE ".add_brackets($mainTable).".".add_brackets($keyField)."=@0;";
$paramCount=1;
$params[1]=$keyValue;
$dbRecordset=app_dbRead($dbConnection, $sql, $paramCount, $params);
$fCount=0;
$row=$dbRecordset->fetch_array(MYSQLI_BOTH);
while ($x = $dbRecordset->fetch_field()) {
  for ($j=1;$j<=$fieldCounter;$j++) {
      if (strtoupper($x->name)==strtoupper($names[$j])) {
        $fieldtype=app_getType($x->type);
        $fieldvalue=app_getDBfield($row, $names[$j], $fieldtype); 
        if ($fieldvalue != $values[$j]) {
          $fCount++;
          $fieldlist[$fCount]=$names[$j];
          $valuelist[$fCount]=$values[$j];
        }
      }
  }
}
$dbRecordset->close();
$nn=app_dbUpdate($dbConnection,$mainTable,$fCount,$fieldlist,$valuelist,$keyField,$keyValue);
echo $nn." APPML_MESSAGE_RECORD_UPDATED";
exit();
//'''''''''''''''''''''''''''''''''''''''''''''''''''''

function app_setFromPosition($pos,$type,$lines,$total) {
$from=$pos;
if ($type == "first") {$from=1;}
if ($type == "next") {$from+=$lines;}
if ($type == "previous") {$from-=$lines;}
if ($type == "last") {$from=$total-$lines + 1;}
if ($from > $total) {$from=$total;}
if ($from < 1) {$from=1;}
if ($type == "new") {$from=0;}
return $from;
}


function app_setToPosition($from,$type,$lines,$total) {
$to=$from + $lines-1;
if ($lines == 0 || $to > $total) {$to=$total;}
return $to;
}


function app_getRecordAsXML($keyValue, $fieldName, $fieldType, $fieldValue, $numb) {
$x="<record>\r\n";
$x.=$keyValue."\r\n";
for ($i=1; $i<=$numb; $i++) {
  $x.="<item>\r\n";
  $x.="<name>".$fieldName[$i]."</name>\r\n";
  $x.="<type>".$fieldType[$i]."</type>\r\n";
  $val=$fieldValue[$i];
  $n="";
  for ($j=1; $j<=strlen($val); $j++) {
    $c=substr($val,$j-1,1);
    if ($c == "<") {$c="#1001;";}
    if ($c == ">") {$c="#1002;";}
    if ($c == "&") {$c="#1003;";}
    $n.=$c;  
  }
  $x.="<value>".$n."</value>\r\n";
  $x.="</item>\r\n";
}
$x.="</record>\r\n";
return $x;
}
function appml_GetQueryWhere($txtParam,$filter,$requestFilter,$paramCount,$params) {
$legalQueryField=array();
$legalQueryFieldType=array();
$qvalue=array();
$qvaluecount=0;
$where=$txtParam;
$legalQueryFieldcount=0;
$txt=$filter;
if ($txt != "") {
  $txt=app_getElement($txt, "query");
  if ($txt != "") {
    $arr=app_getElementArray($txt, "field");
    $l=app_arrayLength($arr);
    for ($i=1; $i<=$l; $i++) {
      $legalQueryFieldcount=$i;
      $legalQueryField[$i]=app_getElementValue($arr[$i], "field");
      $legalQueryFieldType[$i]=app_getAttribute($arr[$i], "type");
    }
  }
}
$arr=app_getElementArray($requestFilter, "query");
$l=app_arrayLength($arr);
for ($j=1; $j<=$l; $j++) {    
  $qOK=1;
  $qlabel="";
  $qvaluecount=0;
  $qoper="";
  $qname=app_getElementValue($arr[$j], "field");
  $qlabel=app_getElementValue($arr[$j], "label");
  $valuearr=app_getElementArray($arr[$j], "value");
  $ll=app_arrayLength($valuearr);
  for ($i=1; $i<=$ll; $i++) {
    $qvaluecount=$i;
    $qvalue[$i]=app_getElementValue($valuearr[$i], "value");
  }
  $qoper=app_getElementValue($arr[$j], "operator");
  $queryOK=0;
  for ($i=1; $i<=$legalQueryFieldcount; $i++) {
    if (strtolower($qname) == strtolower($legalQueryField[$i])) {
      $qtype=$legalQueryFieldType[$i];
      $queryOK=1;
      break;
    }
  }
  if ($queryOK == 0) {app_error("APPML_ERR_ILLEGAL_QUERY: ".$qname);}
  for ($i=1; $i<=$qvaluecount; $i++) {
    if ($qvalue[$i] == "&nbsp;") {$qvalue[$i]=" ";}
    if ($qlabel == "") {$qlabel=$qname;}
    if ($qoper == "") {$qoper="=";}
    if ($qoper == "0") {$qoper="=";}
    if ($qoper == "1") {$qoper="<>";}
    if ($qoper == "2") {$qoper="<";}
    if ($qoper == "3") {$qoper=">";}
    if ($qoper == "4") {$qoper="<=";}
    if ($qoper == "5") {$qoper=">=";}
    if ($qoper == "6") {$qoper="%";}
    if ($qoper == "10") {$qoper="==";}
    if ($qoper == "11") {$qoper="!=";}
    if ($qvalue[$i] != "") {
      $qvalue[$i]=remove_quotes($qvalue[$i]);
      if ($where == "") {$where=" (";}
      else {
        if ($i == 1) {$where.=" AND (";}
        else {
          if ($qoper == "=" || $qoper == "==" || $qoper == "%") {
            $where.=" OR ";
          }
          else {$where.=" AND ";}
        }
      }
      if ($qtype == "number" || $qtype == "date") {
        if ($qOK == 1) {
          $xqoper=$qoper;
          if ($xqoper == "==") {$xqoper="=";}
          if ($xqoper == "!=") {$xqoper="<>";}
          //$where.="(".add_brackets($qname).$xqoper.$qvalue[$i].")";
          $where.="(".add_brackets($qname).$xqoper."@".(string)$paramCount.")";
          $paramCount++;
          $params[$paramCount]=$qvalue[$i];
        }
        else {$where.=" (".add_brackets($qname).">0 AND ".add_brackets($qname)."<0)";}
      }
      else {
        if ($qvalue[$i] == " ") {
          if ($qoper == "=" || $qoper == "==") {$where.="(".add_brackets($qname)."='')";}
          if ($qoper == "<>" || $qoper == "!=") {$where.="(".add_brackets($qname)."<>'')";}
          if ($qoper == "<" || $qoper == ">" || $qoper == "<=" || $qoper == ">=") {$where.="(".add_brackets($qname).$qoper."'')";}
          if ($qoper == "%") {$where.="(".add_brackets($qname)." LIKE '% %')";}
        }
        else {
          if ($qoper == "=") {
              //$where.="(".add_brackets($qname)." LIKE '".$qvalue[$i]."%')";
              $where.="(".add_brackets($qname)." LIKE @".(string)$paramCount.")";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i].'%';
              }
          if ($qoper == "==") {
              //$where.="(".add_brackets($qname)." = '".$qvalue[$i]."')";
              $where.="(".add_brackets($qname)." =  @".(string)$paramCount.")";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
          if ($qoper == "<" || $qoper == ">") {
              //$where.="(".add_brackets($qname).$qoper."'".$qvalue[$i]."')";
              $where.="(".add_brackets($qname).$qoper." @".(string)$paramCount.")";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
          if ($qoper == "<>") {
              //$where.="(".add_brackets($qname).$qoper."'".$qvalue[$i]."' AND ".add_brackets($qname)." NOT LIKE '".$qvalue[$i]."%')";
              $where.="(".add_brackets($qname).$qoper."@".(string)$paramCount." AND ".add_brackets($qname)." NOT LIKE @".(string)($paramCount+1).")";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              $paramCount++;
              $params[$paramCount]=$qvalue[$i].'%';
              }
          if ($qoper == "!=") {
              //$where.="(".add_brackets($qname)."<>'".$qvalue[$i]."')";
              $where.="(".add_brackets($qname)."<> @".(string)$paramCount.")";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
          if ($qoper == "<=" || $qoper == ">=") {
              //$where.="(".add_brackets($qname).$qoper."'".$qvalue[$i]."' OR ".add_brackets($qname)." LIKE '".$qvalue[$i]."%')";
              $where.="(".add_brackets($qname).$qoper." @".(string)$paramCount." OR ".add_brackets($qname)." LIKE @".(string)($paramCount+1).")";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              $paramCount++;
              $params[$paramCount]=$qvalue[$i].'%';
              }
          if ($qoper == "%") {
              //$where.="(".add_brackets($qname)." LIKE '%".$qvalue[$i]."%')";
              $where.="(".add_brackets($qname)." LIKE @".(string)$paramCount.")";
              $paramCount++;
              $params[$paramCount]='%'.$qvalue[$i].'%';
              }
        }
      }
    }
    if ($i == $qvaluecount) {$where.=")";}
  }
}
return $where;
}  



function xxxappml_GetQueryWhere($txtParam,$filter,$requestFilter,$paramCount,$params) {
$legalQueryField=array();
$legalQueryFieldType=array();
$qvalue=array();




$qvaluecouhnt="0";
$where=$txtParam;
$legalQueryFieldcount=0;
$txt=$filter;
if ($txt != "") {
  $txt=app_getElement($txt, "query");
  if ($txt != "") {
    $arr=app_getElementArray($txt, "field");
    $l=app_arrayLength($arr);
    for ($i=1; $i<=$l; $i++) {
      $legalQueryFieldcount=$i;
      $legalQueryField[$i]=app_getElementValue($arr[$i], "field");
      $legalQueryFieldType[$i]=app_getAttribute($arr[$i], "type");
    }
  }
}
$arr=app_getElementArray($requestFilter, "query");
$l=app_arrayLength($arr);
for ($j=1; $j<=$l; $j++) {
  $qOK=1;
  $qlabel="";
  $qvaluecount=0;
  $qoper="";
  $qname=app_getElementValue($arr[$j], "field");
  $qlabel=app_getElementValue($arr[$j], "label");
  $valuearr=app_getElementArray($arr[$j], "value");
  $l=app_arrayLength($valuearr);
  for ($i=1; $i<=$l; $i++) {
    $qvaluecount=$i;
    $qvalue[$i]=app_getElementValue($valuearr[$i], "value");
  }
  $qoper=app_getElementValue($arr[$j], "operator");
  $queryOK=0;
  for ($i=1; $i<=$legalQueryFieldcount; $i++) {
    if (strtolower($qname) == strtolower($legalQueryField[$i])) {
      $qtype=$legalQueryFieldType[$i];
      $queryOK=1;
      break;
    }
  }
  if ($queryOK == 0) {app_error("APPML_ERR_ILLEGAL_QUERY: ".$qname);}
  for ($i=1; $i<=$qvaluecount; $i++) {
    if ($qvalue[$i] == "&nbsp;") {$qvalue[$i]=" ";}
    if ($qlabel == "") {$qlabel=$qname;}
    if ($qoper == "") {$qoper="=";}
    if ($qoper == "0") {$qoper="=";}
    if ($qoper == "1") {$qoper="<>";}
    if ($qoper == "2") {$qoper="<";}
    if ($qoper == "3") {$qoper=">";}
    if ($qoper == "4") {$qoper="<=";}
    if ($qoper == "5") {$qoper=">=";}
    if ($qoper == "6") {$qoper="%";}
    if ($qoper == "10") {$qoper="==";}
    if ($qoper == "11") {$qoper="!=";}
    if ($qvalue[$i] != "") {
      $qvalue[$i]=remove_quotes($qvalue[$i]);
      if ($where == "") {$where=" (";}
      else {
        if ($i == 1) {$where.=" AND (";}
        else {
          if ($qoper == "=" || $qoper == "==" || $qoper == "%") {
            $where.=" OR ";
          }
          else {$where.=" AND ";}
        }
      }



      if ($qtype == "number" || $qtype == "date") {
        if ($qOK == 1) {
          $xqoper=$qoper;
          if ($xqoper == "==") {$xqoper="=";}
          if ($xqoper == "!=") {$xqoper="<>";}
          $where.="(".add_brackets($qname).$xqoper.$qvalue[$i].")";
          $paramCount++;
          $params[$paramCount]=$qvalue[$i];
        }
        else {$where.=" (".add_brackets($qname).">0 AND ".add_brackets($qname)."<0)";}
      }
      else {
        if ($qvalue[$i] == " ") {
          if ($qoper == "=" || $qoper == "==") {$where.="(".add_brackets($qname)."='')";}
          if ($qoper == "<>" || $qoper == "!=") {$where.="(".add_brackets($qname)."<>'')";}
          if ($qoper == "<" || $qoper == ">" || $qoper == "<=" || $qoper == ">=") {$where.="(".add_brackets($qname).$qoper."'')";}
          if ($qoper == "%") {$where.="(".add_brackets($qname)." LIKE '% %')";}
        }
        else {
          if ($qoper == "=") {
              $where.="(".add_brackets($qname)." LIKE '".$qvalue[$i]."%')";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
          if ($qoper == "==") {
              $where.="(".add_brackets($qname)." = '".$qvalue[$i]."')";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
          if ($qoper == "<" || $qoper == ">") {
              $where.="(".add_brackets($qname).$qoper."'".$qvalue[$i]."')";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
          if ($qoper == "<>") {
              $where.="(".add_brackets($qname).$qoper."'".$qvalue[$i]."' AND ".add_brackets($qname)." NOT LIKE '".$qvalue[$i]."%')";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
          if ($qoper == "!=") {
              $where.="(".add_brackets($qname)."<>'".$qvalue[$i]."')";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
          if ($qoper == "<=" || $qoper == ">=") {
              $where.="(".add_brackets($qname).$qoper."'".$qvalue[$i]."' OR ".add_brackets($qname)." LIKE '".$qvalue[$i]."%')";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
          if ($qoper == "%") {
              $where.="(".add_brackets($qname)." LIKE '%".$qvalue[$i]."%')";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
        }
      }
    }
    if ($i == $qvaluecount) {$where.=")";}
  }
}
return $where;
}  

function appml_GetOrderby($filter,$requestFilter) {
$legalOrderbyField=array();
$legalOrderbyDir=array();
$osfield=array();
$osdir=array();
$oscount=0;
$legalOrderbyFieldcount=0;
$orderby="";
$txt=$filter;
if ($txt != "") {
  $txt=app_getElement($txt, "order");
  if ($txt != "") {
    $arr=app_getElementArray($txt, "field");
    $l=app_arrayLength($arr);
    for ($i=1; $i<=$l; $i++) {
      $legalOrderbyFieldcount=$i;
      $legalOrderbyField[$i]=app_getElementValue($arr[$i], "field");
      $legalOrderbyDir[$i]="asc";
    }
  }
}
$arr=app_getElementArray($requestFilter, "orderby");
$l=app_arrayLength($arr);
for ($i=1; $i<=$l; $i++) {
  $oscount=$i;
  $osfield[$oscount]=app_getElementValue($arr[$i], "field");
  $osdir[$oscount]=app_getElementValue($arr[$i], "direction");
}
$orderselect="";
for ($i=1; $i<=$oscount; $i++) {
  if ($osfield[$i] != "") {
    $orderbyOK=0;
    for ($j=1; $j<=$legalOrderbyFieldcount; $j++) {
      if (trim($osfield[$i]) == trim($legalOrderbyField[$j])) {
        $orderbyOK=1;
        break;
      }
    }
    if ($orderbyOK == 1) {
      if ($orderselect != "") {$orderselect.=",";}
      $orderselect.=" ".$osfield[$i]." ".$osdir[$i];
    }
  }
}
if ($orderselect != "" && $orderby != "") {
  $orderby=$orderselect.", ".$orderby;
}
else {
  if ($orderselect != "" && $orderby == "") {
    $orderby=$orderselect;
  }
}
if ($orderby != "") {
  $orderby=" ORDER BY ".$orderby;
}
else {
  for ($i=1; $i<=$legalOrderbyFieldcount; $i++) {
    if ($i == 1) {
      $orderby=" ORDER BY ";
    }
    if ($i > 1) {
      $orderby.=",";
    }
    $orderby.=$legalOrderbyField[$i];
    $orderby.=" ".$legalOrderbyDir[$i];
  }
}
return $orderby;
}

function add_brackets($txt) {return $txt;}

function app_formatDate($txt, $appformat) {
if (app_nullTest($txt)) {
  return "";
}
if (trim($txt) == "") {
  return "";
}
$date=date_create($txt);
$y=date_format($date,"Y");
$m=date_format($date,"m");
$d=date_format($date,"d");
$h=date_format($date,"H");
$n=date_format($date,"i");
$s=date_format($date,"s");  
$c=substr($y,2,2);
if (strlen($m) < 2) {$m="0".$m;}
if (strlen($d) < 2) {$d="0".$d;}
if (strlen($h) < 2) {$h="0".$h;}
if (strlen($n) < 2) {$n="0".$n;}
if (strlen($s) < 2) {$s="0".$s;}
$t=$appformat;
$t=str_replace("yyyy",$y,$t);
$t=str_replace("mm",$m,$t);
$t=str_replace("dd",$d,$t);
$t=str_replace("yy",$c,$t);
$t=str_replace("hh",$h,$t);
$t=str_replace("nn",$n,$t);
$t=str_replace("ss",$s,$t);
return $t;
}

function app_getSQLDateFormat() {
return "yyyy-mm-dd";
}

function getUserAccess($security) {
$ret="";
$userAccess="";
if (app_nullTest($security)) {
  $sec="";
}
else {
  $sec=strtoupper($security);
}
if ($sec == "") {
  $ret="OK";
}
else {
  $sec=trim($sec);
  $userAccess=app_getSession("appmlaccess");
}
if ($userAccess != "") {
  $ARR=explode(",",$userAccess);
  foreach ($ARR as $x) {
    $z=trim(strtoupper($x));
    if ($sec == $z) {
      return "OK";
    }
  }
}
return $ret;
}

function app_error($errtxt) {
echo "<";
echo "?xml version='1.0' encoding='UTF-8'?";
echo ">";
echo "<appml><error><![CDATA[".$errtxt."]]></error></appml>";
exit();
return;
}

function app_reformatDate($txt,$dtype) {
$ret="";
if ($txt != "") {
  $d=substr($txt,_instr(0,$dtype,"dd",0)-1,2);
  $m=substr($txt,_instr(0,$dtype,"mm",0)-1,2);
  $y=substr($txt,_instr(0,$dtype,"yyyy",0)-1,4);
  $ret=$y."-".$m."-".$d;
}
return $ret;
}

function remove_quotes($ttt) {
$out="";
if (app_nullTest($ttt)) {return "";}
for ($i=1; $i<=strlen($ttt); $i++) {
  $c=substr($ttt,$i-1,1);
  if ($c == "'") {$c="''";}
  $out.=$c;
}
return $out;
}

function app_getElementValue($element, $id) {
$res="";
$uelement=strtoupper($element);
$uid=strtoupper($id);
$ipos1=_instr(0,$uelement,"<".$uid,0);
if ($ipos1 > 0) {
  $ipos2=_instr(0,substr($uelement,$ipos1-1),">",0);
  $ipos3=_instr(0,$uelement,"</".$uid.">",0);
  if ($ipos2 > 0 && $ipos3 > $ipos1) {
    $res=trim(substr($element,$ipos1 + $ipos2-1,$ipos3-$ipos2-$ipos1));
  }
}
return $res;
}

function app_getElement($element, $id) {
$uelement=strtoupper($element);
$uid=strtoupper($id);
$ipos1=_instr(0,$uelement,"<".$uid,0);
$ipos3=_instr(0,$uelement,"</".$uid.">",0);
$res="";
if ($ipos1 > 0) {
  if ($ipos3 > $ipos1) {
    $res=substr($element,$ipos1-1,$ipos3-$ipos1 + strlen($id) + 3);
  }
  else {
    $ipos3=_instr(0,substr($uelement,$ipos1-1),"/>",0);
    if ($ipos3 > 0) {
      $res=substr($element,$ipos1-1,$ipos3 + 1);
    }
  }
}
return $res;
}

function app_getAttribute($element, $attribute) {
$txt=$element;
$res="";
$tst=34;
$ipos=_instr(0,$txt," ".$attribute."=".chr($tst),0);
if ($ipos == 0) {
  $tst=39;
  $ipos=_instr(0,$txt," ".$attribute."=".chr($tst),0);
}
if ($ipos != 0) {
  $txt=substr($txt,$ipos + strlen($attribute) + 2);
  $ipos=_instr(0,$txt,chr($tst),0);
  if ($ipos > 1) {
    $res=substr($txt,0,$ipos-1);
  }
}
return $res;
}

function app_getElementArray($element, $id) {
$x=array();
$uid=strtoupper($id);
$xelement=$element;
$l=0;
for ($i=1; $i<=10000; $i++) {
  $uelement=strtoupper($xelement);
  $ipos1=_instr(0,$uelement,"<".$uid,0);
  $ipos3=_instr(0,$uelement,"</".$uid.">",0);
  if ($ipos1 > 0 && $ipos3 > $ipos1) {
    $l++;
    $x[$l]=substr($xelement,$ipos1-1,$ipos3-$ipos1 + strlen($id) + 3);
    $xelement=substr($xelement,$ipos3 + strlen($id) + 2);
  }
  else {
    break;
  }
}
return $x;
}

function app_arrayLength($arr) {return count($arr); }

function app_getSysDecSep() {
$decsep=1 / 2;
$decsep=($decsep);
$decsep=substr($decsep,1,1);
return $decsep;
}

function app_setNull() {return NULL;}

function app_readRequest() {
$tmp="";
$file=fopen("php://input","r") or exit("Unable to open file!");
while (!feof($file))  {$tmp=$tmp.fgetc($file);}
fclose($file);
return $tmp;
}

function app_loadTextFromFile($fname) {
$tmp="";
$ext=".xml";
if (_instr(0,$fname,".",0) > 0) {$ext="";}
$lines=file($fname.$ext);
foreach ($lines as $value) {
  if (!$tmp)
    {$tmp = $value;}
    else
    {$tmp=$tmp.$value;}
}
return $tmp;
}

function app_nullTest($x) {
$cc=false;
if (!isset($x)) {$cc=true;}
else {
  if (empty($x)) {$cc=true;}
}
return $cc;
}

function app_setSession($nam, $acc) {
$_SESSION["appmluser"]=$nam;
$_SESSION["appmlaccess"]=$acc;
return 0;
}

function app_getSession($nam) {
return $_SESSION[$nam];
}

function app_dbRead($conn,$sql,$count,$p) {
$xarr=array();
$xsql=app_prepSQL($sql,$count);
$stmt=$conn->stmt_init();
$stmt=$conn->prepare($xsql);
if ($count>0) {
    $xarr[0]="";
    for ($j=1;$j<=$count;$j++) {
        $xarr[0].="s";
        $xarr[$j]=&$p[$j];
    }
    call_user_func_array(array($stmt,'bind_param'), $xarr);
}
$stmt->execute();
if (!$dbRecordset = $stmt->get_result()) {app_error($conn->error);}
return $dbRecordset;
}

function app_executeSQL($conn,$sql,$xcount) {
for ($i=1; $i<=$xcount; $i++) {
    //$sql[$i]=iconv("ISO-8859-1", "UTF-8//TRANSLIT", $sql[$i]);
    if (!$conn->query($sql[$i])) {app_error($conn->error." ".$sql[$i]);}
}
return;
}

function app_dbUpdate($conn,$table,$count,$fields,$values,$keyField,$keyValue) {
$xarr=array();
if ($count==0) {return 0;}
$sql="UPDATE ".$table." SET ";
$xarr[0]="";
for ($i=1;$i<=$count;$i++) {
  $xarr[0].="s";
  $xarr[$i]=&$values[$i];
  $sql=$sql.$fields[$i]."=@".(string)($i-1)." ";
  if ($i!=$count) {$sql=$sql.",";}
}
$xarr[0].="s";
$xarr[$count+1]=&$keyValue;
$sql=$sql." WHERE ".$keyField."=@".(string)($count)." ";
$sql=app_prepSQL($sql,$count+1);
$stmt=$conn->stmt_init();
$stmt=$conn->prepare($sql);
call_user_func_array(array($stmt,'bind_param'), $xarr);
if (!$stmt->execute()) {app_error($conn->error." ".$sql);}
$num=$conn->affected_rows;
$conn->close();
return $num;
}

function app_dbAddNew($conn,$table,$count,$fields,$values,$types) {
$xarr=array();
$sql="INSERT INTO ".$table."(";
for ($i=1;$i<=$count;$i++)
  {
  $sql=$sql.$fields[$i];
  if ($i!=$count) {$sql=$sql.",";}
  }
$sql=$sql.") VALUES (";
$xarr[0]="";
for ($i=1;$i<=$count;$i++)
  {
  $xarr[0].="s";
  $sql.="@".(string)($i-1);
  $xarr[$i]=&$values[$i];
  if ($i!=$count) {$sql=$sql.",";}
  }
$sql=$sql.");";
$sql=app_prepSQL($sql,$count);
$stmt=$conn->stmt_init();
$stmt=$conn->prepare($sql);
call_user_func_array(array($stmt,'bind_param'), $xarr);
if (!$stmt->execute()) {app_error($conn->error." ".$sql);}
$num=$stmt->insert_id;
$conn->close();
return $num;
}

function app_dbDelete($conn,$mainTable,$keyField,$keyValue) {
$sql="DELETE FROM ".add_brackets($mainTable)." WHERE ".$keyField."=@0;";
$sql=app_prepSQL($sql,1);
$stmt=$conn->stmt_init();
$stmt=$conn->prepare($sql);
$stmt->bind_param('s',$keyValue);
if (!$stmt->execute()) {app_error($conn->error." ".$sql);}
$num=$conn->affected_rows;
$conn->close();
return $num;
}

function app_getDbConnection($dbcon,$model) {
$arr=array();
$xdbcon=strtoupper($dbcon);
$arr=app_getElementArray($model,"database");
$txt="";
$l=app_arrayLength($arr);
for ($i=1;$i<=$l;$i++) {
  $x=app_getAttribute($arr[$i],"name");
	if (strtoupper($x)==$xdbcon) {
      $txt=app_getElementValue($arr[$i],"database");
      break;
    }	
}
if ($txt=="") {app_error("APPML_ERR_UKNOWN_DB: ".$dbcon);}
$dbHost=app_getElementValue($txt,"host");
$dbName=app_getElementValue($txt,"name");
$dbUser=app_getElementValue($txt,"user");
$dbPass=app_getElementValue($txt,"password");
$conn = new mysqli($dbHost,$dbUser,$dbPass,$dbName);
$conn->set_charset('utf8');
return $conn;
} 

function app_readCSVFile($filename) {
try {
$x=array();
$i=0;
$lines=file($filename);
foreach ($lines as $value) {
  $i++;
  $x[$i] = $value;
  }
$i++;
$x[$i] = "";
}
catch (Exception $e){app_error("APPML_ERR_ERROR: ".$e);}
return $x;
}

function app_getDBfield($row, $fnam, $typ) {
$x="";
try {
    $x=$row[$fnam];
    if (app_nullTest($x)) {$x="";}
    else {
      if ($typ == "date") {
        $x=app_formatDate($x, app_GetSQLDateFormat());}
        else {$x=(string)$x;}
    }
}
catch (Exception $e){$x="";} 
return $x;
}

function app_dbRowcount($recset) {
return $recset->num_rows;
}

function app_prepSQL($sql,$count) {
$mysql=$sql;
for ($i=1;$i<=$count;$i++) {
$mysql=str_replace("@".(string)($i-1),"?",$mysql);
}
return $mysql;
}

function app_getType($txt) {
$ret="number";
if ($txt==252) {$ret="binary";}
if ($txt==7 || $txt==10 || $txt==11 || $txt==12 || $txt==13) {$ret="date";}
if ($txt==253 || $txt==254) {$ret="string";}
return $ret;
}

function app_isDate($x) {$x=true;}

function app_cDate($x) {return strtotime($x);}

// Helper Function
function _instr($start,$str1,$str2,$mode) {
if ($mode) { $str1=strtolower($str1); $str2=strtolower($str2); }
$retval=strpos($str1,$str2,$start);
return ($retval===false) ? 0 : $retval+1;
}
?>