
#SingleInstance force
#HotkeyInterval 1000
#MaxHotkeysPerInterval 100
#NoTrayIcon

; [SYS] autostart section

SplitPath, A_ScriptFullPath, SYS_ScriptNameExt, SYS_ScriptDir, SYS_ScriptExt, SYS_ScriptNameNoExt, SYS_ScriptDrive
SYS_ScriptVersion = 1.1
SYS_ScriptBuild = 20050702195845
SYS_ScriptInfo = %SYS_ScriptNameNoExt% %SYS_ScriptVersion%

Process, Priority, , HIGH
SetBatchLines, -1
; TODO : a nulled key delay may produce problems for WinAmp control
SetKeyDelay, 0, 0
SetMouseDelay, 0
SetDefaultMouseSpeed, 0
SetWinDelay, 0
SetControlDelay, 0

Gosub, SYS_ParseCommandLine
Gosub, CFG_LoadSettings
Gosub, CFG_ApplySettings

if ( !A_IsCompiled )
  SetTimer, REL_ScriptReload, 1000

OnExit, SYS_ExitHandler

Gosub, TRY_TrayInit

Return

; [SYS] parses command line parameters

SYS_ParseCommandLine:
  Loop %0%
    If ( (%A_Index% = "/x") or (%A_Index% = "/exit") )
    ExitApp
Return

; [SYS] exit handler

SYS_ExitHandler:
  ;Gosub, AOT_ExitHandler
  ;Gosub, ROL_ExitHandler
  Gosub, TRA_ExitHandler
  Gosub, CFG_SaveSettings
ExitApp

; [SYS] handles tooltips

SYS_ToolTipShow:
  If ( SYS_ToolTipText )
  {
    If ( !SYS_ToolTipSeconds )
      SYS_ToolTipSeconds = 1
    SYS_ToolTipMillis := SYS_ToolTipSeconds * 1000
    CoordMode, Mouse, Screen
    CoordMode, ToolTip, Screen
    If ( !SYS_ToolTipX or !SYS_ToolTipY )
    {
      MouseGetPos, SYS_ToolTipX, SYS_ToolTipY
      SYS_ToolTipX += 16
      SYS_ToolTipY += 24
    }
    ToolTip, %SYS_ToolTipText%, %SYS_ToolTipX%, %SYS_ToolTipY%
    SetTimer, SYS_ToolTipHandler, %SYS_ToolTipMillis%
  }
  SYS_ToolTipText =
  SYS_ToolTipSeconds =
  SYS_ToolTipX =
  SYS_ToolTipY =
Return

SYS_ToolTipFeedbackShow:
  If ( SYS_ToolTipFeedback )
    Gosub, SYS_ToolTipShow
  SYS_ToolTipText =
  SYS_ToolTipSeconds =
  SYS_ToolTipX =
  SYS_ToolTipY =
Return

SYS_ToolTipHandler:
  SetTimer, SYS_ToolTipHandler, Off
  ToolTip
Return

; [SYS] handles balloon messages

SYS_TrayTipShow:
  If ( SYS_TrayTipText )
  {
    If ( !SYS_TrayTipTitle )
      SYS_TrayTipTitle = %SYS_ScriptInfo%
    If ( !SYS_TrayTipSeconds )
      SYS_TrayTipSeconds = 10
    If ( !SYS_TrayTipOptions )
      SYS_TrayTipOptions = 17
    SYS_TrayTipMillis := SYS_TrayTipSeconds * 1000
    Gosub, SYS_TrayTipBalloonCheck
    If ( SYS_TrayTipBalloon and !A_IconHidden )
    {
      TrayTip, %SYS_TrayTipTitle%, %SYS_TrayTipText%, %SYS_TrayTipSeconds%, %SYS_TrayTipOptions%
      SetTimer, SYS_TrayTipHandler, %SYS_TrayTipMillis%
    }
    Else
    {
      TrayTip
      SYS_ToolTipText = %SYS_TrayTipTitle%:`n`n%SYS_TrayTipText%
      SYS_ToolTipSeconds = %SYS_TrayTipSeconds%
      SysGet, SYS_TrayTipDisplay, Monitor
      SYS_ToolTipX = %SYS_TrayTipDisplayRight%
      SYS_ToolTipY = %SYS_TrayTipDisplayBottom%
      Gosub, SYS_ToolTipShow
    }
  }
  SYS_TrayTipTitle =
  SYS_TrayTipText =
  SYS_TrayTipSeconds =
  SYS_TrayTipOptions =
Return

SYS_TrayTipHandler:
  SetTimer, SYS_TrayTipHandler, Off
  TrayTip
Return

SYS_TrayTipBalloonCheck:
  RegRead, SYS_TrayTipBalloonCU, HKEY_CURRENT_USER, Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced, EnableBalloonTips
  SYS_TrayTipBalloonCU := ErrorLevel or SYS_TrayTipBalloonCU
  RegRead, SYS_TrayTipBalloonLM, HKEY_LOCAL_MACHINE, Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced, EnableBalloonTips
  SYS_TrayTipBalloonLM := ErrorLevel or SYS_TrayTipBalloonLM
  SYS_TrayTipBalloon := SYS_TrayTipBalloonCU and SYS_TrayTipBalloonLM
Return

; [SUS] provides suspend services

SUS_SuspendSaveState:
  SUS_Suspended := A_IsSuspended
Return

SUS_SuspendRestoreState:
  If ( SUS_Suspended )
    Suspend, On
  Else
    Suspend, Off
Return

SUS_SuspendHandler:
  IfWinActive, A
  {
    WinGet, SUS_WinID, ID
    If ( !SUS_WinID )
      Return
    WinGet, SUS_WinMinMax, MinMax, ahk_id %SUS_WinID%
    WinGetPos, SUS_WinX, SUS_WinY, SUS_WinW, SUS_WinH, ahk_id %SUS_WinID%

    If ( (SUS_WinMinMax = 0) and (SUS_WinX = 0) and (SUS_WinY = 0) and (SUS_WinW = A_ScreenWidth) and (SUS_WinH = A_ScreenHeight) )
    {
      WinGetClass, SUS_WinClass, ahk_id %SUS_WinID%
      WinGet, SUS_ProcessName, ProcessName, ahk_id %SUS_WinID%
      SplitPath, SUS_ProcessName, , , SUS_ProcessExt
      If ( (SUS_WinClass != "Progman") and (SUS_ProcessExt != "scr") and !SUS_FullScreenSuspend )
      {
        SUS_FullScreenSuspend = 1
        SUS_FullScreenSuspendState := A_IsSuspended
        If ( !A_IsSuspended )
        {
          Suspend, On
         ; SYS_TrayTipText = A full screen window was activated.`nNiftyWindows is suspended now.`nPress WIN+ESC to resume it again.
          SYS_TrayTipOptions = 2
          Gosub, SYS_TrayTipShow
          Gosub, TRY_TrayUpdate
        }
      }
    }
    Else
    {
      If ( SUS_FullScreenSuspend )
      {
        SUS_FullScreenSuspend = 0
        If ( A_IsSuspended and !SUS_FullScreenSuspendState )
        {
          Suspend, Off
        ;  SYS_TrayTipText = A full screen window was deactivated.`nNiftyWindows is resumed now.`nPress WIN+ESC to suspend it again.
          Gosub, SYS_TrayTipShow
          Gosub, TRY_TrayUpdate
        }
      }
    }
  }
Return

; [NWD] nifty window dragging

/**
 * This is the most powerful feature of NiftyWindows. The area of every window 
 * is tiled in a virtual 9-cell grid with three columns and rows. The center 
 * cell is the largest one and you can grab and move a window around by clicking 
 * and holding it with the right mouse button. The other eight corner cells are 
 * used to resize a resizable window in the same manner.
*/
$XButton2::
$+XButton2::
$+!XButton2::
$+^XButton2::
$+#XButton2::
$+!^XButton2::
$+!#XButton2::
$+^#XButton2::
$+!^#XButton2::
$!XButton2::
$!^XButton2::
$!#XButton2::
$!^#XButton2::
$^XButton2::
$^#XButton2::
$#XButton2::

  If not GetKeyState("LButton", "P"){
    NWD_ResizeGrids = 10
    NWD_ResizeGridsW = 10
    NWD_Dragging_TEMP = 0
  } Else {
    ; 如果按住 鼠标左键 则在窗口三分之一的位置就可以改变大小
    NWD_ResizeGrids = 4
    NWD_ResizeGridsW = 6
    NWD_Dragging_TEMP = 1
  }

  CoordMode, Mouse, Screen
  MouseGetPos, NWD_MouseStartX, NWD_MouseStartY, NWD_WinID
  If ( !NWD_WinID )
    Return
  WinGetPos, NWD_WinStartX, NWD_WinStartY, NWD_WinStartW, NWD_WinStartH, ahk_id %NWD_WinID%
  WinGet, NWD_WinMinMax, MinMax, ahk_id %NWD_WinID%
  WinGet, NWD_WinStyle, Style, ahk_id %NWD_WinID%
  WinGetClass, NWD_WinClass, ahk_id %NWD_WinID%
  GetKeyState, NWD_CtrlState, Ctrl, P

  ; the and'ed condition checks for popup window:
  ; (WS_POPUP) and !(WS_DLGFRAME | WS_SYSMENU | WS_THICKFRAME)
  If ( (NWD_WinClass = "Progman") or ((NWD_CtrlState = "U") and (((NWD_WinStyle & 0x80000000) and !(NWD_WinStyle & 0x4C0000)) or (NWD_WinClass = "ExploreWClass") or (NWD_WinClass = "CabinetWClass") or (NWD_WinClass = "IEFrame") or (NWD_WinClass = "MozillaWindowClass") or (NWD_WinClass = "OpWindow") or (NWD_WinClass = "ATL:ExplorerFrame") or (NWD_WinClass = "ATL:ScrapFrame"))) )
  {
    NWD_ImmediateDownRequest = 1
    NWD_ImmediateDown = 0
    NWD_PermitClick = 1
  }
  Else
  {
    NWD_ImmediateDownRequest = 0
    NWD_ImmediateDown = 0
    NWD_PermitClick = 1
  }

  NWD_Dragging := (NWD_WinClass != "Progman") and ((NWD_CtrlState = "D") or ((NWD_WinMinMax != 1) and !NWD_ImmediateDownRequest))

  ; checks wheter the window has a sizing border (WS_THICKFRAME)
  If ( (NWD_CtrlState = "D") or (NWD_WinStyle & 0x40000) )
  {
    If ( (NWD_MouseStartX >= NWD_WinStartX + NWD_WinStartW / NWD_ResizeGridsW) and (NWD_MouseStartX <= NWD_WinStartX + (NWD_ResizeGridsW - 1) * NWD_WinStartW / NWD_ResizeGridsW) )
    NWD_ResizeX = 0
    Else
      If ( NWD_MouseStartX > NWD_WinStartX + NWD_WinStartW / 2 )
    NWD_ResizeX := 1
    Else
      NWD_ResizeX := -1

    If ( (NWD_MouseStartY >= NWD_WinStartY + NWD_WinStartH / NWD_ResizeGrids) and (NWD_MouseStartY <= NWD_WinStartY + (NWD_ResizeGrids - 1) * NWD_WinStartH / NWD_ResizeGrids) )
    NWD_ResizeY = 0
    Else
      If ( NWD_MouseStartY > NWD_WinStartY + NWD_WinStartH / 2 )
    NWD_ResizeY := 1
    Else
      NWD_ResizeY := -1
  }
  Else
  {
    NWD_ResizeX = 0
    NWD_ResizeY = 0
  }

  If ( NWD_WinStartW and NWD_WinStartH )
    NWD_WinStartAR := NWD_WinStartW / NWD_WinStartH
  Else
    NWD_WinStartAR = 0

  ; TODO : this is a workaround (checks for popup window) for the activation 
  ; bug of AutoHotkey -> can be removed as soon as the known bug is fixed
  If ( !((NWD_WinStyle & 0x80000000) and !(NWD_WinStyle & 0x4C0000)) )
    IfWinNotActive, ahk_id %NWD_WinID%
    WinActivate, ahk_id %NWD_WinID%

  ; TODO : the hotkeys must be enabled in the 2nd block because the 1st block 
  ; activates them only for the first call (historical problem of AutoHotkey)
  Hotkey, Shift, NWD_IgnoreKeyHandler
  Hotkey, Ctrl, NWD_IgnoreKeyHandler
  Hotkey, Alt, NWD_IgnoreKeyHandler
  Hotkey, LWin, NWD_IgnoreKeyHandler
  Hotkey, RWin, NWD_IgnoreKeyHandler
  Hotkey, Shift, On
  Hotkey, Ctrl, On
  Hotkey, Alt, On
  Hotkey, LWin, On
  Hotkey, RWin, On
  SetTimer, NWD_IgnoreKeyHandler, 100
  SetTimer, NWD_WindowHandler, 10
Return

NWD_SetDraggingOff:
  NWD_Dragging = 0
Return

NWD_SetClickOff:
  NWD_PermitClick = 0
  NWD_ImmediateDownRequest = 0
Return

NWD_SetAllOff:
  Gosub, NWD_SetDraggingOff
  Gosub, NWD_SetClickOff
Return

NWD_IgnoreKeyHandler:
  GetKeyState, NWD_XButton2State, XButton2, P
  GetKeyState, NWD_RButtonState, RButton, P
  GetKeyState, NWD_ShiftState, Shift, P
  GetKeyState, NWD_CtrlState, Ctrl, P
  GetKeyState, NWD_AltState, Alt, P
  ; TODO : unlike the other modifiers, Win does not exist 
  ; as a virtual key (but Ctrl, Alt and Shift do)
  GetKeyState, NWD_LWinState, LWin, P
  GetKeyState, NWD_RWinState, RWin, P
  If ( (NWD_LWinState = "D") or (NWD_RWinState = "D") )
    NWD_WinState = D
  Else
    NWD_WinState = U

  If ( (NWD_RButtonState = "U") and (NWD_ShiftState = "U") and (NWD_CtrlState = "U") and (NWD_AltState = "U") and (NWD_WinState = "U") )
  {
    SetTimer, NWD_IgnoreKeyHandler, Off
    Hotkey, Shift, Off
    Hotkey, Ctrl, Off
    Hotkey, Alt, Off
    Hotkey, LWin, Off
    Hotkey, RWin, Off
  }
Return

/*
 * TODO  改变窗体大小的核心代码
*/
NWD_WindowHandler:
  SetWinDelay, -1
  CoordMode, Mouse, Screen
  MouseGetPos, NWD_MouseX, NWD_MouseY
  WinGetPos, NWD_WinX, NWD_WinY, NWD_WinW, NWD_WinH, ahk_id %NWD_WinID%
  GetKeyState, NWD_RButtonState, RButton, P ;
  GetKeyState, NWD_XButton2State, XButton2, P
  GetKeyState, NWD_ShiftState, Shift, P
  GetKeyState, NWD_AltState, Alt, P
  ; TODO : unlike the other modifiers, Win does not exist 
  ; as a virtual key (but Ctrl, Alt and Shift do)
  GetKeyState, NWD_LWinState, LWin, P
  GetKeyState, NWD_RWinState, RWin, P
  If ( (NWD_LWinState = "D") or (NWD_RWinState = "D") )
    NWD_WinState = D
  Else
    NWD_WinState = U

  If ( NWD_XButton2State = "U" ) ; NWD_RButtonState
  {
    SetTimer, NWD_WindowHandler, Off

    If ( NWD_ImmediateDown )
      MouseClick, RIGHT, %NWD_MouseX%, %NWD_MouseY%, , , U
    Else
      If ( NWD_PermitClick and (!NWD_Dragging or ((NWD_MouseStartX = NWD_MouseX) and (NWD_MouseStartY = NWD_MouseY))) )
    {
      MouseClick, RIGHT, %NWD_MouseStartX%, %NWD_MouseStartY%, , , D
      MouseClick, RIGHT, %NWD_MouseX%, %NWD_MouseY%, , , U
    }

    Gosub, NWD_SetAllOff
    NWD_ImmediateDown = 0
  }
  Else
  {
    NWD_MouseDeltaX := NWD_MouseX - NWD_MouseStartX
    NWD_MouseDeltaY := NWD_MouseY - NWD_MouseStartY

    If (NWD_Dragging_TEMP){
      NWD_MouseDeltaY_TEMP := NWD_MouseDeltaY

    }Else{
      NWD_MouseDeltaY_TEMP = 0
    }

    If ( NWD_MouseDeltaX or NWD_MouseDeltaY )
    {
      If ( NWD_ImmediateDownRequest and !NWD_ImmediateDown )
      {
        MouseClick, RIGHT, %NWD_MouseStartX%, %NWD_MouseStartY%, , , D
        MouseMove, %NWD_MouseX%, %NWD_MouseY%
        NWD_ImmediateDown = 1
        NWD_PermitClick = 0
      }

      If ( NWD_Dragging )
      {
        If ( !NWD_ResizeX and !NWD_ResizeY )
        {

          NWD_WinNewX := NWD_WinStartX + NWD_MouseDeltaX
          NWD_WinNewY := NWD_WinStartY + NWD_MouseDeltaY_TEMP
          NWD_WinNewW := NWD_WinStartW
          NWD_WinNewH := NWD_WinStartH
        }
        Else
        {
          NWD_WinDeltaW = 0
          NWD_WinDeltaH = 0
          If ( NWD_ResizeX )
            NWD_WinDeltaW := NWD_ResizeX * NWD_MouseDeltaX
          If ( NWD_ResizeY )
            NWD_WinDeltaH := NWD_ResizeY * NWD_MouseDeltaY
          If ( NWD_WinState = "D" )
          {
            If ( NWD_ResizeX )
              NWD_WinDeltaW *= 2
            If ( NWD_ResizeY )
              NWD_WinDeltaH *= 2
          }
          NWD_WinNewW := NWD_WinStartW + NWD_WinDeltaW
          NWD_WinNewH := NWD_WinStartH + NWD_WinDeltaH
          If ( NWD_WinNewW < 0 )
            If ( NWD_WinState = "D" )
            NWD_WinNewW *= -1
          Else
            NWD_WinNewW := 0
          If ( NWD_WinNewH < 0 )
            If ( NWD_WinState = "D" )
            NWD_WinNewH *= -1
          Else
            NWD_WinNewH := 0
          If ( (NWD_AltState = "D") and NWD_WinStartAR )
          {
            NWD_WinNewARW := NWD_WinNewH * NWD_WinStartAR
            NWD_WinNewARH := NWD_WinNewW / NWD_WinStartAR
            If ( NWD_WinNewW < NWD_WinNewARW )
              NWD_WinNewW := NWD_WinNewARW
            If ( NWD_WinNewH < NWD_WinNewARH )
              NWD_WinNewH := NWD_WinNewARH
          }
          NWD_WinDeltaX = 0
          NWD_WinDeltaY = 0
          If ( NWD_WinState = "D" )
          {
            NWD_WinDeltaX := NWD_WinStartW / 2 - NWD_WinNewW / 2
            NWD_WinDeltaY := NWD_WinStartH / 2 - NWD_WinNewH / 2
          }
          Else
          {
            If ( NWD_ResizeX = -1 )
              NWD_WinDeltaX := NWD_WinStartW - NWD_WinNewW
            If ( NWD_ResizeY = -1 )
              NWD_WinDeltaY := NWD_WinStartH - NWD_WinNewH
          }
          NWD_WinNewX := NWD_WinStartX + NWD_WinDeltaX
          NWD_WinNewY := NWD_WinStartY + NWD_WinDeltaY
        }

        If ( NWD_ShiftState = "D" )
          NWD_WinNewRound = -1
        Else
          NWD_WinNewRound = 0

        Transform, NWD_WinNewX, Round, %NWD_WinNewX%, %NWD_WinNewRound%
        Transform, NWD_WinNewY, Round, %NWD_WinNewY%, %NWD_WinNewRound%
        Transform, NWD_WinNewW, Round, %NWD_WinNewW%, %NWD_WinNewRound%
        Transform, NWD_WinNewH, Round, %NWD_WinNewH%, %NWD_WinNewRound%

        If ( (NWD_WinNewX != NWD_WinX) or (NWD_WinNewY != NWD_WinY) or (NWD_WinNewW != NWD_WinW) or (NWD_WinNewH != NWD_WinH) )
        {
          WinMove, ahk_id %NWD_WinID%, , %NWD_WinNewX%, %NWD_WinNewY%, %NWD_WinNewW%, %NWD_WinNewH%

          If ( SYS_ToolTipFeedback )
          {
            WinGetPos, NWD_ToolTipWinX, NWD_ToolTipWinY, NWD_ToolTipWinW, NWD_ToolTipWinH, ahk_id %NWD_WinID%
            SYS_ToolTipText = Window Drag: (X:%NWD_ToolTipWinX%, Y:%NWD_ToolTipWinY%, W:%NWD_ToolTipWinW%, H:%NWD_ToolTipWinH%)
            Gosub, SYS_ToolTipFeedbackShow
          }
        }
      }
    }
  }
Return

; [MIW {NWD}] minimize/roll on right + left mouse button

/**
 * Minimizes the selected window (if minimizable) to the task bar. If you press 
 * the left button over the titlebar the selected window will be rolled up 
 * instead of being minimized. You have to apply this action again to roll the 
 * window back down.
*/

$XButton1::
$^XButton1::
  GetKeyState, MIW_RButtonState, XButton2, P
  If ( (MIW_RButtonState = "D") and (!NWD_ImmediateDown) and (NWD_WinClass != "Progman") )
  {
    GetKeyState, MIW_CtrlState, Ctrl, P
    WinGet, MIW_WinStyle, Style, ahk_id %NWD_WinID%
    MouseGetPos, , MIW_MouseY

    ; checks wheter the window has a sizing border (WS_THICKFRAME)
    If ( (MIW_CtrlState = "D") or (MIW_WinStyle & 0x40000) )
    {
      Gosub, NWD_SetAllOff
      ROL_WinID = %NWD_WinID%
      Gosub, ROL_RollToggle
    }

  }
  Else
  {
    ; this feature should be implemented by using a timer because 
    ; AutoHotkeys threading blocks the first thread if another 
    ; one is started (until the 2nd is stopped)

    Thread, priority, 1
    MouseClick, X1, , , , , D
    KeyWait, XButton1
    MouseClick, X1, , , , , U
  }
Return

; [TSW {NWD}] provides alt-tab-menu to the right mouse button + mouse wheel

/**
 * 弹窗所有窗体，滚动切换
 * Provides a quick task switcher (alt-tab-menu) controlled by the mouse wheel.
*/

WheelDown::
  GetKeyState, TSW_RButtonState, LButton, P
  If ( (TSW_RButtonState = "D") and (!NWD_ImmediateDown) )
  {
    Btns:= {0:"LAlt",1:"LCtrl"}
    key:= "LAlt" ;Btns[IS_VS()] 
    ; TODO : this is a workaround because the original tabmenu 
    ; code of AutoHotkey is buggy on some systems
    GetKeyState, TSW_LAltState, %key%
    If ( TSW_LAltState = "U" )
    {
      Gosub, NWD_SetAllOff
      Send, {%key% down}{Tab}
      SetTimer, TSW_WheelHandler, 1
    }
    Else
      Send, {Tab}
  }
  Else
    Send, {WheelDown}
Return

WheelUp::
  GetKeyState, TSW_RButtonState, LButton, P
  If ( (TSW_RButtonState = "D") and (!NWD_ImmediateDown) )
  {
    ; TODO : this is a workaround because the original tabmenu 
    ; code of AutoHotkey is buggy on some systems
    Btns:= {0:"LAlt",1:"LCtrl"}
    key:= "LAlt"

    GetKeyState, TSW_LAltState, %key%
    If ( TSW_LAltState = "U" )
    {
      Gosub, NWD_SetAllOff
      Send, {%key% down}+{Tab}
      SetTimer, TSW_WheelHandler, 1
    }
    Else
      Send, +{Tab}
  }
  Else
    Send, {WheelUp}
Return

TSW_WheelHandler:
  GetKeyState, TSW_RButtonState, LButton, P
  If ( TSW_RButtonState = "U" )
  {
    SetTimer, TSW_WheelHandler, Off

    Btns:= {0:"LAlt",1:"LCtrl"}
    key:= "LAlt"
    GetKeyState, TSW_LAltState, %key%
    If ( TSW_LAltState = "D" )
      Send, {%key% up}
  }
Return

; [ROL] rolls up/down a window to/from its title bar

ROL_RollToggle:
  Gosub, ROL_CheckWinIDs
  SetWinDelay, -1
  IfWinNotExist, ahk_id %ROL_WinID%
    Return
  WinGetClass, ROL_WinClass, ahk_id %ROL_WinID%
  If ( ROL_WinClass = "Progman" )
    Return

  IfNotInString, ROL_WinIDs, |%ROL_WinID%
  {
    SYS_ToolTipText = Window Roll: UP
    Gosub, ROL_RollUp
  }
  Else
  {
    WinGetPos, , , , ROL_WinHeight, ahk_id %ROL_WinID%
    If ( ROL_WinHeight = ROL_WinRolledHeight%ROL_WinID% )
    {
      SYS_ToolTipText = Window Roll: DOWN
      Gosub, ROL_RollDown
    }
    Else
    {
      SYS_ToolTipText = Window Roll: UP
      Gosub, ROL_RollUp
    }
  }
  Gosub, SYS_ToolTipFeedbackShow
Return

ROL_RollUp:
  Gosub, ROL_CheckWinIDs
  SetWinDelay, -1
  IfWinNotExist, ahk_id %ROL_WinID%
    Return
  WinGetClass, ROL_WinClass, ahk_id %ROL_WinID%
  If ( ROL_WinClass = "Progman" )
    Return

  WinGetPos, , , , ROL_WinHeight, ahk_id %ROL_WinID%
  IfInString, ROL_WinIDs, |%ROL_WinID%
    If ( ROL_WinHeight = ROL_WinRolledHeight%ROL_WinID% ) 
    Return
  SysGet, ROL_CaptionHeight, 4 ; SM_CYCAPTION
  SysGet, ROL_BorderHeight, 7 ; SM_CXDLGFRAME
  If ( ROL_WinHeight > (ROL_CaptionHeight + ROL_BorderHeight) )
  {
    IfNotInString, ROL_WinIDs, |%ROL_WinID%
      ROL_WinIDs = %ROL_WinIDs%|%ROL_WinID%
    ROL_WinOriginalHeight%ROL_WinID% := ROL_WinHeight
    WinMove, ahk_id %ROL_WinID%, , , , , (ROL_CaptionHeight + ROL_BorderHeight+100)
    WinGetPos, , , , ROL_WinRolledHeight%ROL_WinID%, ahk_id %ROL_WinID%
  }
Return

ROL_RollDown:
  Gosub, ROL_CheckWinIDs
  SetWinDelay, -1
  If ( !ROL_WinID )
    Return
  IfNotInString, ROL_WinIDs, |%ROL_WinID%
    Return
  WinGetPos, , , , ROL_WinHeight, ahk_id %ROL_WinID%
  If( ROL_WinHeight = ROL_WinRolledHeight%ROL_WinID% )
    WinMove, ahk_id %ROL_WinID%, , , , , ROL_WinOriginalHeight%ROL_WinID%
  StringReplace, ROL_WinIDs, ROL_WinIDs, |%ROL_WinID%, , All
  ROL_WinOriginalHeight%ROL_WinID% =
  ROL_WinRolledHeight%ROL_WinID% =
Return

ROL_RollDownAll:
  Gosub, ROL_CheckWinIDs
  Loop, Parse, ROL_WinIDs, |
    If ( A_LoopField )
  {
    ROL_WinID = %A_LoopField%
    Gosub, ROL_RollDown
  }
Return

#^r::
  Gosub, ROL_RollDownAll
  SYS_ToolTipText = Window Roll: ALL DOWN
  Gosub, SYS_ToolTipFeedbackShow
Return

ROL_CheckWinIDs:
  DetectHiddenWindows, On
  Loop, Parse, ROL_WinIDs, |
    If ( A_LoopField )
    IfWinNotExist, ahk_id %A_LoopField%
  {
    StringReplace, ROL_WinIDs, ROL_WinIDs, |%A_LoopField%, , All
    ROL_WinOriginalHeight%A_LoopField% =
    ROL_WinRolledHeight%A_LoopField% =
  }
Return

ROL_ExitHandler:
  Gosub, ROL_RollDownAll
Return

; [TRA] provides window transparency

/**
 * 修改透明度
 * Adjusts the transparency of the active window in ten percent steps 
 * (opaque = 100%) which allows the contents of the windows behind it to shine 
 * through. If the window is completely transparent (0%) the window is still 
 * there and clickable. If you loose a transparent window it will be extremly 
 * complicated to find it again because it's invisible (see the first hotkey 
 * in this list for emergency help in such situations). 
*/

#WheelUp::
#+WheelUp::
#WheelDown::
#+WheelDown::
  Gosub, TRA_CheckWinIDs
  SetWinDelay, -1
  IfWinActive, A
  {
    WinGet, TRA_WinID, ID
    If ( !TRA_WinID )
      Return
    WinGetClass, TRA_WinClass, ahk_id %TRA_WinID%
    If ( TRA_WinClass = "Progman" )
      Return

    IfNotInString, TRA_WinIDs, |%TRA_WinID%
      TRA_WinIDs = %TRA_WinIDs%|%TRA_WinID%
    TRA_WinAlpha := TRA_WinAlpha%TRA_WinID%
    TRA_PixelColor := TRA_PixelColor%TRA_WinID%

    IfInString, A_ThisHotkey, +
      TRA_WinAlphaStep := 255 * 0.01 ; 1 percent steps
    Else
      TRA_WinAlphaStep := 255 * 0.1 ; 10 percent steps

    If ( TRA_WinAlpha = "" )
      TRA_WinAlpha = 255

    IfInString, A_ThisHotkey, WheelDown
      TRA_WinAlpha -= TRA_WinAlphaStep
    Else
      TRA_WinAlpha += TRA_WinAlphaStep

    If ( TRA_WinAlpha > 255 )
      TRA_WinAlpha = 255
    Else
      If ( TRA_WinAlpha < 0 )
      TRA_WinAlpha = 0

    If ( !TRA_PixelColor and (TRA_WinAlpha = 255) )
    {
      Gosub, TRA_TransparencyOff
      SYS_ToolTipText = Transparency: OFF
    }
    Else
    {
      TRA_WinAlpha%TRA_WinID% = %TRA_WinAlpha%

      If ( TRA_PixelColor )
        WinSet, TransColor, %TRA_PixelColor% %TRA_WinAlpha%, ahk_id %TRA_WinID%
      Else
        WinSet, Transparent, %TRA_WinAlpha%, ahk_id %TRA_WinID%

      TRA_ToolTipAlpha := TRA_WinAlpha * 100 / 255
      Transform, TRA_ToolTipAlpha, Round, %TRA_ToolTipAlpha%
      SYS_ToolTipText = Transparency: %TRA_ToolTipAlpha% `%
    }
    Gosub, SYS_ToolTipFeedbackShow
  }
Return

TRA_CheckWinIDs:
  DetectHiddenWindows, On
  Loop, Parse, TRA_WinIDs, |
    If ( A_LoopField )
    IfWinNotExist, ahk_id %A_LoopField%
  {
    StringReplace, TRA_WinIDs, TRA_WinIDs, |%A_LoopField%, , All
    TRA_WinAlpha%A_LoopField% =
    TRA_PixelColor%A_LoopField% =
  }
Return

TRA_ExitHandler:
  ;	Gosub, TRA_TransparencyAllOff
Return

TRA_TransparencyOff:
  Gosub, TRA_CheckWinIDs
  SetWinDelay, -1
  If ( !TRA_WinID )
    Return
  IfNotInString, TRA_WinIDs, |%TRA_WinID%
    Return
  StringReplace, TRA_WinIDs, TRA_WinIDs, |%TRA_WinID%, , All
  TRA_WinAlpha%TRA_WinID% =
  TRA_PixelColor%TRA_WinID% =
  ; TODO : must be set to 255 first to avoid the black-colored-window problem
  WinSet, Transparent, 255, ahk_id %TRA_WinID%
  WinSet, TransColor, OFF, ahk_id %TRA_WinID%
  WinSet, Transparent, OFF, ahk_id %TRA_WinID%
  WinSet, Redraw, , ahk_id %TRA_WinID%
Return

; [SIZ {NWD}] provides several size adjustments to windows

/**
 * Adjusts the transparency of the active window in ten percent steps 
 * (opaque = 100%) which allows the contents of the windows behind it to shine 
 * through. If the window is completely transparent (0%) the window is still 
 * there and clickable. If you loose a transparent window it will be extremly 
 * complicated to find it again because it's invisible (see the first hotkey in 
 * this list for emergency help in such situations). 
 <^WheelUp::
<^WheelDown::
*/

!WheelUp::
!+WheelUp::
!^WheelUp::
!#WheelUp::
!+^WheelUp::
!+#WheelUp::
!^#WheelUp::
!+^#WheelUp::
!WheelDown::
!+WheelDown::
!^WheelDown::
!#WheelDown::
!+^WheelDown::
!+#WheelDown::
!^#WheelDown::
!+^#WheelDown::
  ; TODO : the following code block is a workaround to handle 
  ; virtual ALT calls in WheelDown/Up functions
  GetKeyState, SIZ_AltState, Ctrl, P
  If ( SIZ_AltState = "U" )
  {
    IfInString, A_ThisHotkey, WheelDown
      Gosub, WheelDown
    Else
      Gosub, WheelUp
    Return
  }

  If ( NWD_Dragging or NWD_ImmediateDown )
    Return

  SetWinDelay, -1
  CoordMode, Mouse, Screen
  IfWinActive, A
  {
    WinGet, SIZ_WinID, ID
    If ( !SIZ_WinID )
      Return
    WinGetClass, SIZ_WinClass, ahk_id %SIZ_WinID%
    If ( SIZ_WinClass = "Progman" )
      Return

    GetKeyState, SIZ_CtrlState, Ctrl, P
    WinGet, SIZ_WinMinMax, MinMax, ahk_id %SIZ_WinID%
    WinGet, SIZ_WinStyle, Style, ahk_id %SIZ_WinID%

    ; checks wheter the window isn't maximized and has a sizing border (WS_THICKFRAME)
    If ( (SIZ_CtrlState = "D") or ((SIZ_WinMinMax != 1) and (SIZ_WinStyle & 0x40000)) )
    {
      WinGetPos, SIZ_WinX, SIZ_WinY, SIZ_WinW, SIZ_WinH, ahk_id %SIZ_WinID%

      If ( SIZ_WinW and SIZ_WinH )
      {
        SIZ_AspectRatio := SIZ_WinW / SIZ_WinH

        IfInString, A_ThisHotkey, WheelDown
          SIZ_Direction = 1
        Else
          SIZ_Direction = -1

        IfInString, A_ThisHotkey, +
          SIZ_Factor = 0.01
        Else
          SIZ_Factor = 0.1

        SIZ_WinNewW := SIZ_WinW + SIZ_Direction * SIZ_WinW * SIZ_Factor
        SIZ_WinNewH := SIZ_WinH + SIZ_Direction * SIZ_WinH * SIZ_Factor

        IfInString, A_ThisHotkey, #
        {
          SIZ_WinNewX := SIZ_WinX + (SIZ_WinW - SIZ_WinNewW) / 2
          SIZ_WinNewY := SIZ_WinY + (SIZ_WinH - SIZ_WinNewH) / 2
        }
        Else
        {
          SIZ_WinNewX := SIZ_WinX
          SIZ_WinNewY := SIZ_WinY
        }

        If ( SIZ_WinNewW > A_ScreenWidth )
        {
          SIZ_WinNewW := A_ScreenWidth
          SIZ_WinNewH := SIZ_WinNewW / SIZ_AspectRatio
        }
        If ( SIZ_WinNewH > A_ScreenHeight )
        {
          SIZ_WinNewH := A_ScreenHeight
          SIZ_WinNewW := SIZ_WinNewH * SIZ_AspectRatio
        }

        Transform, SIZ_WinNewX, Round, %SIZ_WinNewX%
        Transform, SIZ_WinNewY, Round, %SIZ_WinNewY%
        Transform, SIZ_WinNewW, Round, %SIZ_WinNewW%
        Transform, SIZ_WinNewH, Round, %SIZ_WinNewH%

        WinMove, ahk_id %SIZ_WinID%, , SIZ_WinNewX, SIZ_WinNewY, SIZ_WinNewW, SIZ_WinNewH

        If ( SYS_ToolTipFeedback )
        {
          WinGetPos, SIZ_ToolTipWinX, SIZ_ToolTipWinY, SIZ_ToolTipWinW, SIZ_ToolTipWinH, ahk_id %SIZ_WinID%
          SYS_ToolTipText = Window Size: (X:%SIZ_ToolTipWinX%, Y:%SIZ_ToolTipWinY%, W:%SIZ_ToolTipWinW%, H:%SIZ_ToolTipWinH%)
          Gosub, SYS_ToolTipFeedbackShow
        }
      }
    }
  }
Return

; [XWN] provides X Window like focus switching (focus follows mouse)

/**
 * Provided a 'X Window' like focus switching by mouse cursor movement. After 
 * activation of this feature (by using the responsible entry in the tray icon 
 * menu) the focus will follow the mouse cursor with a delayed focus change 
 * (after movement end) of 500 milliseconds (half a second). This feature is 
 * disabled per default to avoid any confusion due to the new user-interface-flow.
*/

XWN_FocusHandler:
  CoordMode, Mouse, Screen
  MouseGetPos, XWN_MouseX, XWN_MouseY, XWN_WinID
  If ( !XWN_WinID )
    Return

  If ( (XWN_MouseX != XWN_MouseOldX) or (XWN_MouseY != XWN_MouseOldY) )
  {
    IfWinNotActive, ahk_id %XWN_WinID%
      XWN_FocusRequest = 1
    Else
      XWN_FocusRequest = 0

    XWN_MouseOldX := XWN_MouseX
    XWN_MouseOldY := XWN_MouseY
    XWN_MouseMovedTickCount := A_TickCount
  }
  Else
    If ( XWN_FocusRequest and (A_TickCount - XWN_MouseMovedTickCount > 500) )
  {
    WinGetClass, XWN_WinClass, ahk_id %XWN_WinID%
    If ( XWN_WinClass = "Progman" )
      Return

    ; checks wheter the selected window is a popup menu
    ; (WS_POPUP) and !(WS_DLGFRAME | WS_SYSMENU | WS_THICKFRAME)
    WinGet, XWN_WinStyle, Style, ahk_id %XWN_WinID%
    If ( (XWN_WinStyle & 0x80000000) and !(XWN_WinStyle & 0x4C0000) )
      Return

    IfWinNotActive, ahk_id %XWN_WinID%
      WinActivate, ahk_id %XWN_WinID%

    XWN_FocusRequest = 0
  }
Return

; [TRY] handles the tray icon/menu

TRY_TrayInit:
  Menu, TRAY, NoStandard
  Menu, TRAY, Tip, %SYS_ScriptInfo%

  If ( !A_IsCompiled )
  {
    Menu, AutoHotkey, Standard
    Menu, TRAY, Add, AutoHotkey, :AutoHotkey
    Menu, TRAY, Add
  }

  Menu, TRAY, Add, Help, TRY_TrayEvent
  Menu, TRAY, Default, Help
  Menu, TRAY, Add
  Menu, TRAY, Add, About, TRY_TrayEvent
  Menu, TRAY, Add
  Menu, TRAY, Add, Mail Author, TRY_TrayEvent
  Menu, TRAY, Add, View License, TRY_TrayEvent
  Menu, TRAY, Add, Visit Website, TRY_TrayEvent
  Menu, TRAY, Add, Love, TRY_TrayEvent
  Menu, TRAY, Add

  Menu, MouseHooks, Add, Left Mouse Button, TRY_TrayEvent
  Menu, MouseHooks, Add, Middle Mouse Button, TRY_TrayEvent
  Menu, MouseHooks, Add, Right Mouse Button, TRY_TrayEvent
  Menu, MouseHooks, Add, Fourth Mouse Button, TRY_TrayEvent
  Menu, MouseHooks, Add, Fifth Mouse Button, TRY_TrayEvent
  Menu, TRAY, Add, Mouse Hooks, :MouseHooks

  Menu, TRAY, Add, ToolTip Feedback, TRY_TrayEvent
  Menu, TRAY, Add, Auto Suspend, TRY_TrayEvent
  Menu, TRAY, Add, Focus Follows Mouse, TRY_TrayEvent
  Menu, TRAY, Add, Suspend All Hooks, TRY_TrayEvent
  Menu, TRAY, Add, Revert Visual Effects, TRY_TrayEvent
  Menu, TRAY, Add, Hide Tray Icon, TRY_TrayEvent
  Menu, TRAY, Add
  Menu, TRAY, Add, Exit, TRY_TrayEvent

  Gosub, TRY_TrayUpdate

  If ( A_IconHidden )
    Menu, TRAY, Icon
Return

TRY_TrayUpdate:
  If ( CFG_LeftMouseButtonHook )
    Menu, MouseHooks, Check, Left Mouse Button
  Else
    Menu, MouseHooks, UnCheck, Left Mouse Button
  If ( CFG_MiddleMouseButtonHook )
    Menu, MouseHooks, Check, Middle Mouse Button
  Else
    Menu, MouseHooks, UnCheck, Middle Mouse Button
  If ( CFG_RightMouseButtonHook )
    Menu, MouseHooks, Check, Right Mouse Button
  Else
    Menu, MouseHooks, UnCheck, Right Mouse Button
  If ( CFG_FourthMouseButtonHook )
    Menu, MouseHooks, Check, Fourth Mouse Button
  Else
    Menu, MouseHooks, UnCheck, Fourth Mouse Button
  If ( CFG_FifthMouseButtonHook )
    Menu, MouseHooks, Check, Fifth Mouse Button
  Else
    Menu, MouseHooks, UnCheck, Fifth Mouse Button
  If ( SYS_ToolTipFeedback )
    Menu, TRAY, Check, ToolTip Feedback
  Else
    Menu, TRAY, UnCheck, ToolTip Feedback
  If ( SUS_AutoSuspend )
    Menu, TRAY, Check, Auto Suspend
  Else
    Menu, TRAY, UnCheck, Auto Suspend
  If ( XWN_FocusFollowsMouse )
    Menu, TRAY, Check, Focus Follows Mouse
  Else
    Menu, TRAY, UnCheck, Focus Follows Mouse
  If ( A_IsSuspended )
    Menu, TRAY, Check, Suspend All Hooks
  Else
    Menu, TRAY, UnCheck, Suspend All Hooks
Return

TRY_TrayEvent:
  If ( !TRY_TrayEvent )
    TRY_TrayEvent = %A_ThisMenuItem%

  If ( TRY_TrayEvent = "ToolTip Feedback" )
    SYS_ToolTipFeedback := !SYS_ToolTipFeedback

  If ( TRY_TrayEvent = "Auto Suspend" )
  {
    SUS_AutoSuspend := !SUS_AutoSuspend
    Gosub, CFG_ApplySettings
  }

  If ( TRY_TrayEvent = "Focus Follows Mouse" )
  {
    XWN_FocusFollowsMouse := !XWN_FocusFollowsMouse
    Gosub, CFG_ApplySettings
  }

  If ( TRY_TrayEvent = "Suspend All Hooks" )
    ; Gosub, SUS_SuspendToggle

  If ( TRY_TrayEvent = "Revert Visual Effects" )
    ;	Gosub, SYS_RevertVisualEffects

  If ( TRY_TrayEvent = "Hide Tray Icon" )
  {
    SYS_TrayTipText = Tray icon will be hidden now.`nPress WIN+X to show it again.
    SYS_TrayTipOptions = 2
    SYS_TrayTipSeconds = 5
    Gosub, SYS_TrayTipShow
    SetTimer, TRY_TrayHide, 5000
  }

  If ( TRY_TrayEvent = "Exit" )
    ExitApp

  If ( TRY_TrayEvent = "Left Mouse Button" )
  {
    CFG_LeftMouseButtonHook := !CFG_LeftMouseButtonHook
    Gosub, CFG_ApplySettings
  }

  If ( TRY_TrayEvent = "Middle Mouse Button" )
  {
    CFG_MiddleMouseButtonHook := !CFG_MiddleMouseButtonHook
    Gosub, CFG_ApplySettings
  }

  If ( TRY_TrayEvent = "Right Mouse Button" )
  {
    CFG_RightMouseButtonHook := !CFG_RightMouseButtonHook
    Gosub, CFG_ApplySettings
  }

  If ( TRY_TrayEvent = "Fourth Mouse Button" )
  {
    CFG_FourthMouseButtonHook := !CFG_FourthMouseButtonHook
    Gosub, CFG_ApplySettings
  }

  If ( TRY_TrayEvent = "Fifth Mouse Button" )
  {
    CFG_FifthMouseButtonHook := !CFG_FifthMouseButtonHook
    Gosub, CFG_ApplySettings
  }

  Gosub, TRY_TrayUpdate
  TRY_TrayEvent =
Return

TRY_TrayHide:
  SetTimer, TRY_TrayHide, Off
  Menu, TRAY, NoIcon
Return

; [REL] reloads this script on change

REL_ScriptReload:
  If ( A_IsCompiled )
    Return

  FileGetAttrib, REL_Attribs, %A_ScriptFullPath%
  IfInString, REL_Attribs, A
  {
    FileSetAttrib, -A, %A_ScriptFullPath%
    If ( REL_InitDone )
    {
      Gosub, SUS_SuspendSaveState
      Suspend, On
      MsgBox, 4145, Update Handler - %SYS_ScriptInfo%, The following script has changed:`n`n%A_ScriptFullPath%`n`nReload and activate this script?
      Gosub, SUS_SuspendRestoreState
      IfMsgBox, OK
      Reload
    }
  }
  REL_InitDone = 1
Return

; [CFG] handles the persistent configuration

CFG_LoadSettings:
  CFG_IniFile = %A_ScriptDir%\%SYS_ScriptNameNoExt%.ini
  IniRead, SUS_AutoSuspend, %CFG_IniFile%, Main, AutoSuspend, 1
  IniRead, XWN_FocusFollowsMouse, %CFG_IniFile%, WindowHandling, FocusFollowsMouse, 0
  IniRead, SYS_ToolTipFeedback, %CFG_IniFile%, Visual, ToolTipFeedback, 1
  IniRead, UPD_LastUpdateCheck, %CFG_IniFile%, UpdateCheck, LastUpdateCheck, %A_MM%
  IniRead, CFG_LeftMouseButtonHook, %CFG_IniFile%, MouseHooks, LeftMouseButton, 1
  IniRead, CFG_MiddleMouseButtonHook, %CFG_IniFile%, MouseHooks, MiddleMouseButton, 1
  IniRead, CFG_RightMouseButtonHook, %CFG_IniFile%, MouseHooks, RightMouseButton, 1
  IniRead, CFG_FourthMouseButtonHook, %CFG_IniFile%, MouseHooks, FourthMouseButton, 1
  IniRead, CFG_FifthMouseButtonHook, %CFG_IniFile%, MouseHooks, FifthMouseButton, 1
Return

CFG_SaveSettings:
  CFG_IniFile = %A_ScriptDir%\%SYS_ScriptNameNoExt%.ini
  IniWrite, %SUS_AutoSuspend%, %CFG_IniFile%, Main, AutoSuspend
  IniWrite, %XWN_FocusFollowsMouse%, %CFG_IniFile%, WindowHandling, FocusFollowsMouse
  IniWrite, %SYS_ToolTipFeedback%, %CFG_IniFile%, Visual, ToolTipFeedback
  IniWrite, %UPD_LastUpdateCheck%, %CFG_IniFile%, UpdateCheck, LastUpdateCheck
  IniWrite, %CFG_LeftMouseButtonHook%, %CFG_IniFile%, MouseHooks, LeftMouseButton
  IniWrite, %CFG_MiddleMouseButtonHook%, %CFG_IniFile%, MouseHooks, MiddleMouseButton
  IniWrite, %CFG_RightMouseButtonHook%, %CFG_IniFile%, MouseHooks, RightMouseButton
  IniWrite, %CFG_FourthMouseButtonHook%, %CFG_IniFile%, MouseHooks, FourthMouseButton
  IniWrite, %CFG_FifthMouseButtonHook%, %CFG_IniFile%, MouseHooks, FifthMouseButton
Return

CFG_ApplySettings:
  If ( SUS_AutoSuspend )
    SetTimer, SUS_SuspendHandler, 1000
  Else
    SetTimer, SUS_SuspendHandler, Off

  If ( XWN_FocusFollowsMouse )
    SetTimer, XWN_FocusHandler, 100
  Else
    SetTimer, XWN_FocusHandler, Off

  If ( CFG_LeftMouseButtonHook )
    CFG_LeftMouseButtonHookStr = On
  Else
    CFG_LeftMouseButtonHookStr = Off

  If ( CFG_MiddleMouseButtonHook )
    CFG_MiddleMouseButtonHookStr = On
  Else
    CFG_MiddleMouseButtonHookStr = Off

  If ( CFG_RightMouseButtonHook )
    CFG_RightMouseButtonHookStr = On
  Else
    CFG_RightMouseButtonHookStr = Off

  If ( CFG_FourthMouseButtonHook )
    CFG_FourthMouseButtonHookStr = On
  Else
    CFG_FourthMouseButtonHookStr = Off

  ; Hotkey, $LButton, %CFG_LeftMouseButtonHookStr%
  ; Hotkey, $^LButton, %CFG_LeftMouseButtonHookStr%

  Hotkey, $XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $+XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $+!XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $+^XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $+#XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $+!^XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $+!#XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $+^#XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $+!^#XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $!XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $!^XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $!#XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $!^#XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $^XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $^#XButton2, %CFG_RightMouseButtonHookStr%
  Hotkey, $#XButton2, %CFG_RightMouseButtonHookStr%

  ; Hotkey, $XButton1, %CFG_FourthMouseButtonHookStr%
  ; Hotkey, $^XButton1, %CFG_FourthMouseButtonHookStr%
Return




;=====================================================================o
;                   Feng Ruohang's AHK Script                         | 
;                      CapsLock Enhancement                           |
;---------------------------------------------------------------------o
;Description:                                                         |
;    This Script is wrote by Feng Ruohang via AutoHotKey Script. It   |
; Provieds an enhancement towards the "Useless Key" CapsLock, and     |
; turns CapsLock into an useful function Key just like Ctrl and Alt   |
; by combining CapsLock with almost all other keys in the keyboard.   |
;                                                                     |
;Summary:                                                             |
;o----------------------o---------------------------------------------o
;|CapsLock;             | {ESC}  Especially Convient for vim user     |
;|CaspLock + `          | {CapsLock}CapsLock Switcher as a Substituent|
;|CapsLock + hjklwb     | Vim-Style Cursor Mover                      |
;|CaspLock + uiop       | Convient Home/End PageUp/PageDn             |
;|CaspLock + nm,.       | Convient Delete Controller                  |
;|CapsLock + zxcvay     | Windows-Style Editor                        |
;|CapsLock + Direction  | Mouse Move                                  |
;|CapsLock + Enter      | Mouse Click                                 |
;|CaspLock + {F1}~{F6}  | Media Volume Controller                     |
;|CapsLock + qs         | Windows & Tags Control                      |
;|CapsLock + ;'[]       | Convient Key Mapping                        |
;|CaspLock + dfert      | Frequently Used Programs (Self Defined)     |
;|CaspLock + 123456     | Dev-Hotkey for Visual Studio (Self Defined) |
;|CapsLock + 67890-=    | Shifter as Shift                            |
;-----------------------o---------------------------------------------o
;|Use it whatever and wherever you like. Hope it help                 |
;=====================================================================o


;=====================================================================o
;                       CapsLock Initializer                         ;|
;---------------------------------------------------------------------o
SetCapsLockState, AlwaysOff                                          ;|
;---------------------------------------------------------------------o


;=====================================================================o
;                       CapsLock Switcher:                           ;|
;---------------------------------o-----------------------------------o
;                    CapsLock + ` | {CapsLock}                       ;|
;---------------------------------o-----------------------------------o
CapsLock & `::                                                       ;|
GetKeyState, CapsLockState, CapsLock, T                              ;|
if CapsLockState = D                                                 ;|
    SetCapsLockState, AlwaysOff                                      ;|
else                                                                 ;|
    SetCapsLockState, AlwaysOn                                       ;|
KeyWait, ``                                                          ;|
return                                                               ;|
;---------------------------------------------------------------------o


;=====================================================================o
;                         CapsLock Escaper:                          ;|
;----------------------------------o----------------------------------o
;                        CapsLock  |  {ESC}                          ;|
;----------------------------------o----------------------------------o
CapsLock::Send, {ESC}                                                ;|
;---------------------------------------------------------------------o


;=====================================================================o
;                    CapsLock Direction Navigator                    ;|
;-----------------------------------o---------------------------------o
;                      CapsLock + h |  Left                          ;|
;                      CapsLock + j |  Down                          ;|
;                      CapsLock + k |  Up                            ;|
;                      CapsLock + l |  Right                         ;|
;                      Ctrl, Alt Compatible                          ;|
;-----------------------------------o---------------------------------o
CapsLock & h::                                                       ;|
if GetKeyState("control") = 0                                        ;|
{                                                                    ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, ^{Left}                                                 ;|
    else                                                             ;|
        Send, +{Left}                                                ;|
    return                                                           ;|
}                                                                    ;|
else {                                                               ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, ^{Left}                                                ;|
    else                                                             ;|
        Send, +^{Left}                                               ;|
    return                                                           ;|
}                                                                    ;|
return                                                               ;|
;-----------------------------------o                                ;|
CapsLock & j::                                                       ;|
if GetKeyState("control") = 0                                        ;|
{                                                                    ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, ^{Down}                                                 ;|
    else                                                             ;|
        Send, +{Down}                                                ;|
    return                                                           ;|
}                                                                    ;|
else {                                                               ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, ^{Down}                                                ;|
    else                                                             ;|
        Send, +^{Down}                                               ;|
    return                                                           ;|
}                                                                    ;|
return                                                               ;|
;-----------------------------------o                                ;|
CapsLock & k::                                                       ;|
if GetKeyState("control") = 0                                        ;|
{                                                                    ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, ^{Up}                                                   ;|
    else                                                             ;|
        Send, +{Up}                                                  ;|
    return                                                           ;|
}                                                                    ;|
else {                                                               ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, ^{Up}                                                  ;|
    else                                                             ;|
        Send, +^{Up}                                                 ;|
    return                                                           ;|
}                                                                    ;|
return                                                               ;|
;-----------------------------------o                                ;|
CapsLock & l::                                                       ;|
if GetKeyState("control") = 0                                        ;|
{                                                                    ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, ^{Right}                                                ;|
    else                                                             ;|
        Send, +{Right}                                               ;|
    return                                                           ;|
}                                                                    ;|
else {                                                               ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, ^{Right}                                               ;|
    else                                                             ;|
        Send, +^{Right}                                              ;|
    return                                                           ;|
}                                                                    ;|
return                                                               ;|
;---------------------------------------------------------------------o


;=====================================================================o
;                     CapsLock Home/End Navigator                    ;|
;-----------------------------------o---------------------------------o
;                      CapsLock + i |  Home                          ;|
;                      CapsLock + o |  End                           ;|
;                      Ctrl, Alt Compatible                          ;|
;-----------------------------------o---------------------------------o
CapsLock & i::                                                       ;|
if GetKeyState("control") = 0                                        ;|
{                                                                    ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, {Home}                                                 ;|
    else                                                             ;|
        Send, +{Home}                                                ;|
    return                                                           ;|
}                                                                    ;|
else {                                                               ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, ^{Home}                                                ;|
    else                                                             ;|
        Send, +^{Home}                                               ;|
    return                                                           ;|
}                                                                    ;|
return                                                               ;|
;-----------------------------------o                                ;|
CapsLock & o::                                                       ;|
if GetKeyState("control") = 0                                        ;|
{                                                                    ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, {End}                                                  ;|
    else                                                             ;|
        Send, +{End}                                                 ;|
    return                                                           ;|
}                                                                    ;|
else {                                                               ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, ^{End}                                                 ;|
    else                                                             ;|
        Send, +^{End}                                                ;|
    return                                                           ;|
}                                                                    ;|
return                                                               ;|
;---------------------------------------------------------------------o


;=====================================================================o
;                      CapsLock Page Navigator                       ;|
;-----------------------------------o---------------------------------o
;                      CapsLock + u |  PageUp                        ;|
;                      CapsLock + p |  PageDown                      ;|
;                      Ctrl, Alt Compatible                          ;|
;-----------------------------------o---------------------------------o
CapsLock & u::                                                       ;|
if GetKeyState("control") = 0                                        ;|
{                                                                    ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, {PgUp}                                                 ;|
    else                                                             ;|
        Send, +{PgUp}                                                ;|
    return                                                           ;|
}                                                                    ;|
else {                                                               ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, ^{PgUp}                                                ;|
    else                                                             ;|
        Send, +^{PgUp}                                               ;|
    return                                                           ;|
}                                                                    ;|
return                                                               ;|
;-----------------------------------o                                ;|
CapsLock & p::                                                       ;|
if GetKeyState("control") = 0                                        ;|
{                                                                    ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, {PgDn}                                                 ;|
    else                                                             ;|
        Send, +{PgDn}                                                ;|
    return                                                           ;|
}                                                                    ;|
else {                                                               ;|
    if GetKeyState("alt") = 0                                        ;|
        Send, ^{PgDn}                                                ;|
    else                                                             ;|
        Send, +^{PgDn}                                               ;|
    return                                                           ;|
}                                                                    ;|
return                                                               ;|
;---------------------------------------------------------------------o


;=====================================================================o
;                     CapsLock Mouse Controller                      ;|
;-----------------------------------o---------------------------------o
;                   CapsLock + Up   |  Mouse Up                      ;|
;                   CapsLock + Down |  Mouse Down                    ;|
;                   CapsLock + Left |  Mouse Left                    ;|
;                  CapsLock + Right |  Mouse Right                   ;|
;    CapsLock + Enter(Push Release) |  Mouse Left Push(Release)      ;|
;-----------------------------------o---------------------------------o
CapsLock & Up::    MouseMove, 0, -10, 0, R                           ;|
CapsLock & Down::  MouseMove, 0, 10, 0, R                            ;|
CapsLock & Left::  MouseMove, -10, 0, 0, R                           ;|
CapsLock & Right:: MouseMove, 10, 0, 0, R                            ;|
;-----------------------------------o                                ;|
CapsLock & Enter::                                                   ;|
SendEvent {Blind}{LButton down}                                      ;|
KeyWait Enter                                                        ;|
SendEvent {Blind}{LButton up}                                        ;|
return                                                               ;|
;---------------------------------------------------------------------o


;=====================================================================o
;                           CapsLock Deletor                         ;|
;-----------------------------------o---------------------------------o
;                     CapsLock + n  |  Ctrl + Delete (Delete a Word) ;|
;                     CapsLock + m  |  Delete                        ;|
;                     CapsLock + ,  |  BackSpace                     ;|
;                     CapsLock + .  |  Ctrl + BackSpace              ;|
;-----------------------------------o---------------------------------o
CapsLock & ,:: Send, {Del}                                           ;|
CapsLock & .:: Send, ^{Del}                                          ;|
CapsLock & m:: Send, {BS}                                            ;|
CapsLock & n:: Send, ^{BS}                                           ;|
;---------------------------------------------------------------------o


;=====================================================================o
;                            CapsLock Editor                         ;|
;-----------------------------------o---------------------------------o
;                     CapsLock + z  |  Ctrl + z (Cancel)             ;|
;                     CapsLock + x  |  Ctrl + x (Cut)                ;|
;                     CapsLock + c  |  Ctrl + c (Copy)               ;|
;                     CapsLock + v  |  Ctrl + z (Paste)              ;|
;                     CapsLock + a  |  Ctrl + a (Select All)         ;|
;                     CapsLock + y  |  Ctrl + z (Yeild)              ;|
;                     CapsLock + w  |  Ctrl + Right(Move as [vim: w]);|
;                     CapsLock + b  |  Ctrl + Left (Move as [vim: b]);|
;-----------------------------------o---------------------------------o
CapsLock & z:: Send, ^z                                              ;|
CapsLock & x:: Send, ^x                                              ;|
CapsLock & c:: Send, ^c                                              ;|
CapsLock & v:: Send, ^v                                              ;|
CapsLock & a:: Send, ^a                                              ;|
CapsLock & y:: Send, ^y                                              ;|
; CapsLock & w:: Send, ^{Right}                                        ;|
; CapsLock & b:: Send, ^{Left}                                         ;|
;---------------------------------------------------------------------o


;=====================================================================o
;                       CapsLock Media Controller                    ;|
;-----------------------------------o---------------------------------o
;                    CapsLock + F1  |  Volume_Mute                   ;|
;                    CapsLock + F2  |  Volume_Down                   ;|
;                    CapsLock + F3  |  Volume_Up                     ;|
;                    CapsLock + F3  |  Media_Play_Pause              ;|
;                    CapsLock + F5  |  Media_Next                    ;|
;                    CapsLock + F6  |  Media_Stop                    ;|
;-----------------------------------o---------------------------------o
CapsLock & F1:: Send, {Volume_Mute}                                  ;|
CapsLock & F2:: Send, {Volume_Down}                                  ;|
CapsLock & F3:: Send, {Volume_Up}                                    ;|
CapsLock & F4:: Send, {Media_Play_Pause}                             ;|
CapsLock & F5:: Send, {Media_Next}                                   ;|
CapsLock & F6:: Send, {Media_Stop}                                   ;|
;---------------------------------------------------------------------o


;=====================================================================o
;                      CapsLock Window Controller                    ;|
;-----------------------------------o---------------------------------o
;                     CapsLock + s  |  Ctrl + Tab (Swith Tag)        ;|
;                     CapsLock + q  |  Ctrl + W   (Close Tag)        ;|
;   (Disabled)  Alt + CapsLock + s  |  AltTab     (Switch Windows)   ;|
;               Alt + CapsLock + q  |  Ctrl + Tab (Close Windows)    ;|
;                     CapsLock + g  |  AppsKey    (Menu Key)         ;|
;-----------------------------------o---------------------------------o
CapsLock & q::Send, ^{Tab}                                           ;|
CapsLock & s::Send, ^s                                           ;|
;-----------------------------------o                                ;|
; CapsLock & q::                                                       ;|
; if GetKeyState("alt") = 0                                            ;|
; {                                                                    ;|
;     Send, ^w                                                         ;|
; }                                                                    ;|
; else {                                                               ;|
;     Send, !{F4}                                                      ;|
;     return                                                           ;|
; }                                                                    ;|
; return                                                               ;|
;-----------------------------------o                                ;|
CapsLock & g:: Send, {AppsKey}                                       ;|
;---------------------------------------------------------------------o


;=====================================================================o
;                        CapsLock Self Defined Area                  ;|
;-----------------------------------o---------------------------------o
;                     CapsLock + d  |  Alt + d(Dictionary)           ;|
;                     CapsLock + f  |  Alt + f(Search via Everything);|
;                     CapsLock + f  |  save all  vscode              ;|
;                     CapsLock + e  |  Open Search Engine            ;|
;                     CapsLock + r  |  Open Shell                    ;|
;                     CapsLock + t  |  Open Text Editor              ;|
;-----------------------------------o---------------------------------o
;CapsLock & d:: Send, !d                                              ;|
CapsLock & d:: Send, ^+s                                            ;|
; CapsLock & 3:: Run http://www.baidu.com/                             ;|
; CapsLock & 4:: Run Powershell                                        ;|
; CapsLock & 5:: Run C:\Program Files\Notepad++\notepad++.exe          ;|
;---------------------------------------------------------------------o


;=====================================================================o
;                        CapsLock Char Mapping                       ;|
;-----------------------------------o---------------------------------o
;                     CapsLock + ;  |  Enter (Cancel)                ;|
;                     CapsLock + '  |  =                             ;|
;                     CapsLock + [  |  Back         (Visual Studio)  ;|
;                     CapsLock + ]  |  Goto Define  (Visual Studio)  ;|
;                     CapsLock + /  |  Comment      (Visual Studio)  ;|
;                     CapsLock + \  |  Uncomment    (Visual Studio)  ;|
;                     CapsLock + 1  |  Build and Run(Visual Studio)  ;|
;                     CapsLock + 2  |  Debuging     (Visual Studio)  ;|
;                     CapsLock + 3  |  Step Over    (Visual Studio)  ;|
;                     CapsLock + 4  |  Step In      (Visual Studio)  ;|
;                     CapsLock + 5  |  Stop Debuging(Visual Studio)  ;|
;                     CapsLock + 6  |  Shift + 6     ^               ;|
;                     CapsLock + 7  |  Shift + 7     &               ;|
;                     CapsLock + 8  |  Shift + 8     *               ;|
;                     CapsLock + 9  |  Shift + 9     (               ;|
;                     CapsLock + 0  |  Shift + 0     )               ;|
;-----------------------------------o---------------------------------o
CapsLock & `;:: Send, {Enter}                                        ;|
CapsLock & ':: Send, =                                               ;|
CapsLock & [:: Send, ^-                                              ;|
CapsLock & ]:: Send, {F12}                                           ;|
;-----------------------------------o                                ;|
CapsLock & /::                                                       ;|
Send, ^e                                                             ;|
Send, c                                                              ;|
return                                                               ;|
;-----------------------------------o                                ;|
CapsLock & \::                                                       ;|
Send, ^e                                                             ;|
Send, u                                                              ;|
return                                                               ;|
;-----------------------------------o                                ;|
;CapsLock & 1:: Send,^{F5}                                            ;|
;CapsLock & 2:: Send,{F5}                                             ;|
;CapsLock & 3:: Send,{F10}                                            ;|
;CapsLock & 4:: Send,{F11}                                            ;|
;CapsLock & 5:: Send,+{F5}                                            ;|
;-----------------------------------o                                ;|
;CapsLock & 6:: Send,+6                                               ;|
;CapsLock & 7:: Send,+7                                               ;|
;CapsLock & 8:: Send,+8                                               ;|
;CapsLock & 9:: Send,+9                                               ;|
;CapsLock & 0:: Send,+0                                               ;|
;---------------------------------------------------------------------o

;RCtrl & Q:: Send,#1
;RCtrl & W:: Send,#2                                               ;|
;RCtrl & E:: Send,#3                                               ;|
;RCtrl & R:: Send,#4                                               ;|
;RCtrl & T:: Send,#5                                               ;|
;RCtrl & 5:: Send,{F5}                                             ;|