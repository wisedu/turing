Set objArgs = WScript.Arguments
ZipFile = objArgs(0)

' Create empty ZIP file and open for adding
CreateObject("Scripting.FileSystemObject").CreateTextFile(ZipFile, True).Write "PK" & Chr(5) & Chr(6) & String(18, vbNullChar)
Set zip = CreateObject("Shell.Application").NameSpace(ZipFile)

' Add all files/directories to the .zip file
For i = 1 To objArgs.count-1
  Set target = CreateObject("Shell.Application").NameSpace(objArgs(i))
  zip.CopyHere(target.Items())
  WScript.Sleep 10000 'REQUIRED!! (Depending on file/dir size)
Next
