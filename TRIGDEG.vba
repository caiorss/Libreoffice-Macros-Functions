REM  *****  BASIC  *****
'  Example of Degrees Trigonometric functions in Libreoffice VBA
'  those functions assume that the angle are given in Degrees
'
'  To Insert in the sheet use:
'
'   A1
'       = SIND(60)
'
'
Function RAD2DEG(RAD)
	RAD2DEG = 180.0/PI()*RAD
End Function

Function DEG2RAD(DEG)
	DEG2RAD = PI()/180.0*DEG
End Function

' SIND(Angle)
'
' Returns Sine of an angle in Radians
'
Function SIND(ANGLE)
	SIND = SIN(DEG2RAD(ANGLE))
End Function

Function COSD(ANGLE)
	COSD = COSD(DEG2RAD(ANGLE))
End Function

Function TAND(ANGLE)
	TAND = TAN(DEG2RAD(ANGLE))
End Function

Function ASIND(SINE)
	ASIND = RAD2DEG(ASIN(SINE))
End Function