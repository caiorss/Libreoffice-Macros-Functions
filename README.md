# LIBREOFFICE

Description: Libreoffice Programming Resources and Snippets for LOFFICE Calc Spreadhseet

Descrição:   Recursos de programação e esqueletos de código para a planilha Libreoffice Calc

Files:

* Algorithms.js : Libreoffice calc algorightms of Financial Functions  ported to Javascript

## Command Line

Convert html to pdf

```bash

$ libreoffice --headless --invisible --nologo --convert-to pdf *.html

```

Convert Doc to Text

```bash

libreoffice --headless --convert-to txt:text --outdir "/tmp/outdir" "/path/to/file.doc"

```

$ Convert to pdf in command line (put it in .bashrc)

cpdf () {
libreoffice --headless --convert-to pdf "$1"
} 


# Programmer Documentation

## Details

* It is not possible to edit/debug a Python macro within OpenOffice, it has to be edited with an external editor and can 
only be executed in OpenOffice. Debugging can be a little bit difficult 


## Documentation Reference



Baisc

* [http://www.openoffice.org/documentation/manuals/](http://www.openoffice.org/documentation/manuals/)

* [Writing a Macro in LibreOffice Calc](http://www.debugpoint.com/2014/09/writing-a-macro-in-libreoffice-calc-getting-started/)

* [ Calc Macros Automating repetitive tasks](http://www.openoffice.org/documentation/manuals/userguide3/0312CG3-CalcMacros.pdf)

* [Programming OpenOffice.org with Visual Basic](http://www.kalitech.fr/clients/doc/VB_APIOOo_en.html)

* [Convert VBA to OpenOffice Basic](http://www.business-spreadsheets.com/vba2oo.asp)

* [Programação de Macros com LibreOffice Basic](http://www.slideshare.net/ambientelivre/programao-de-macros-com-libreoffice-basic-39378198)


Python

* [Open Office Wiki Documentation](http://wiki.openoffice.org/wiki/Main_Page)
* [Libreoffice API](http://api.libreoffice.org/)
    * [XScriptContext.html](http://www.openoffice.org/api/docs/common/ref/com/sun/star/script/provider/XScriptContext.html)

* [Writing Calc Functions in Python](http://ooo-forums.apache.org/en/forum/viewtopic.php?f=20&t=43686)

Examples:

* [LO Programming Documentation](http://en.libreofficeforum.org/node/6017)
* Examples of Macros, in Japanese: [http://openoffice3.web.fc2.com/Python_Macro_Calc.html](http://openoffice3.web.fc2.com/Python_Macro_Calc.html)
* [A simple Python Macro in LibreOffice 4.0](https://tmtlakmal.wordpress.com/2013/08/11/a-simple-python-macro-in-libreoffice-4-0/)
* [Tutorial de macros em Python no OpenOffice.org](http://hacklab.com.br/2010/08/23/tutorial-de-macros-em-python-no-openoffice-org/)
* [Python Macros para o Openoffice](http://programeempython.blog.br/blog/python-para-macros-do-openoffice-final)

## Script Directories

Python Macro Directory: /usr/lib/libreoffice/share/Scripts/python

User Script Directories:

### User Directories Location

Linux:

    ~/.config/libreoffice/3/user (since LibreOffice 3.5.0)
    ~/.libreoffice/3/user (prior to LibreOffice 3.5.0)
    


Darwin/MAC/OSx: 	
    
    /Users/<user name>/Library/Application Support/libreoffice/3/user

Windows:

    	Before Vista: \Documents and Setting\<user name>\Application Data\libreoffice\3\user
	    From Vista: \Users\<user name>\AppData\Roaming\libreoffice\3\user



## Install

### Install Script Support

```bash

$ sudo apt-get install libreoffice-script-provider-python

$ sudo apt-get install python-uno

```