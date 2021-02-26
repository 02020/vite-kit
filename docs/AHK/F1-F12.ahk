
; [GRP] groups windows for quick task switching

/**
 * Activates the next window in a process window group that was defined 
 * gradually before with the given CTRL modifier. This feature causes the first 
 * window of the responsible group to be activated. Using it a second time will 
 * activate the next window in the series and so on. By using process window 
 * groups you can organize and access your process windows in semantic groups 
 * quickly. 
 */

^#F1::
^#F2::
^#F3::
^#F4::
^#F5::
^#F6::
^#F7::
^#F8::
^#F9::
^#F10::
^#F11::
^#F12::
^#F13::
^#F14::
^#F15::
^#F16::
^#F17::
^#F18::
^#F19::
^#F20::
^#F21::
^#F22::
^#F23::
^#F24::
	IfWinActive, A
	{
		WinGet, GRP_WinID, ID
		If ( !GRP_WinID )
			Return
		WinGetClass, GRP_WinClass, ahk_id %GRP_WinID%
		If ( GRP_WinClass = "Progman" )
			Return
		WinGet, GRP_WinPID, PID
		If ( !GRP_WinPID )
			Return
			
		StringMid, GRP_GroupNumber, A_ThisHotkey, 3, 3
		GroupAdd, Group%GRP_GroupNumber%, ahk_PID %GRP_WinPID%
		
		SYS_ToolTipText = Active window was added to group %GRP_GroupNumber%.
		Gosub, SYS_ToolTipFeedbackShow
	}
Return

#F1::
#F2::
#F3::
#F4::
#F5::
#F6::
#F7::
#F8::
#F9::
#F10::
#F11::
#F12::
#F13::
#F14::
#F15::
#F16::
#F17::
#F18::
#F19::
#F20::
#F21::
#F22::
#F23::
#F24::
	StringMid, GRP_GroupNumber, A_ThisHotkey, 2, 3
	GroupActivate, Group%GRP_GroupNumber%
	
	SYS_ToolTipText = Activated next window in group %GRP_GroupNumber%.
	Gosub, SYS_ToolTipFeedbackShow
Return

!#F1::
!#F2::
!#F3::
!#F4::
!#F5::
!#F6::
!#F7::
!#F8::
!#F9::
!#F10::
!#F11::
!#F12::
!#F13::
!#F14::
!#F15::
!#F16::
!#F17::
!#F18::
!#F19::
!#F20::
!#F21::
!#F22::
!#F23::
!#F24::
	StringMid, GRP_GroupNumber, A_ThisHotkey, 3, 3
	GroupClose, Group%GRP_GroupNumber%, A
	
	SYS_ToolTipText = Closed all windows in group %GRP_GroupNumber%.
	Gosub, SYS_ToolTipFeedbackShow
Return



!NumpadAdd::
!^NumpadAdd::
!#NumpadAdd::
!^#NumpadAdd::
!NumpadSub::
!^NumpadSub::
!#NumpadSub::
!^#NumpadSub::
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
			
			IfInString, A_ThisHotkey, NumpadAdd
				If ( SIZ_WinW < 160 )
					SIZ_WinNewW = 160
				Else
					If ( SIZ_WinW < 320 )
						SIZ_WinNewW = 320
					Else
						If ( SIZ_WinW < 640 )
							SIZ_WinNewW = 640
						Else
							If ( SIZ_WinW < 800 )
								SIZ_WinNewW = 800
							Else
								If ( SIZ_WinW < 1024 )
									SIZ_WinNewW = 1024
								Else
									If ( SIZ_WinW < 1152 )
										SIZ_WinNewW = 1152
									Else
										If ( SIZ_WinW < 1280 )
											SIZ_WinNewW = 1280
										Else
											If ( SIZ_WinW < 1400 )
												SIZ_WinNewW = 1400
											Else
												If ( SIZ_WinW < 1600 )
													SIZ_WinNewW = 1600
												Else
													SIZ_WinNewW = 1920
			Else
				If ( SIZ_WinW <= 320 )
					SIZ_WinNewW = 160
				Else
					If ( SIZ_WinW <= 640 )
						SIZ_WinNewW = 320
					Else
						If ( SIZ_WinW <= 800 )
							SIZ_WinNewW = 640
						Else
							If ( SIZ_WinW <= 1024 )
								SIZ_WinNewW = 800
							Else
								If ( SIZ_WinW <= 1152 )
									SIZ_WinNewW = 1024
								Else
									If ( SIZ_WinW <= 1280 )
										SIZ_WinNewW = 1152
									Else
										If ( SIZ_WinW <= 1400 )
											SIZ_WinNewW = 1280
										Else
											If ( SIZ_WinW <= 1600 )
												SIZ_WinNewW = 1400
											Else
												If ( SIZ_WinW <= 1920 )
													SIZ_WinNewW = 1600
												Else
													SIZ_WinNewW = 1920
			
			If ( SIZ_WinNewW > A_ScreenWidth )
				SIZ_WinNewW := A_ScreenWidth
			SIZ_WinNewH := 3 * SIZ_WinNewW / 4
			If ( SIZ_WinNewW = 1280 )
				SIZ_WinNewH := 1024
			
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
Return



#MButton::
	Gosub, TRA_CheckWinIDs
	SetWinDelay, -1
	MouseGetPos, , , TRA_WinID
	If ( !TRA_WinID )
		Return
	IfWinNotActive, ahk_id %TRA_WinID%
		WinActivate, ahk_id %TRA_WinID%
	IfNotInString, TRA_WinIDs, |%TRA_WinID%
		Return
	;Gosub, TRA_TransparencyOff

	;SYS_ToolTipText = Transparency: OFF
	;Gosub, SYS_ToolTipFeedbackShow
Return
; [CLW {NWD}] close/send bottom on right + middle mouse button || double click on middle mouse button

/**
 * Closes the selected window (if closeable) as if you click the close button 
 * in the titlebar. If you press the middle button over the titlebar the 
 * selected window will be sent to the bottom of the window stack instead of 
 * being closed.
 */

$MButton::
$^MButton::
	GetKeyState, CLW_RButtonState, RButton, P
	If ( (CLW_RButtonState = "D") and (!NWD_ImmediateDown) and (NWD_WinClass != "Progman") )
	{
		GetKeyState, CLW_CtrlState, Ctrl, P
		WinGet, CLW_WinStyle, Style, ahk_id %NWD_WinID%
		SysGet, CLW_CaptionHeight, 4 ; SM_CYCAPTION
		SysGet, CLW_BorderHeight, 7 ; SM_CXDLGFRAME
		MouseGetPos, , CLW_MouseY

		If ( CLW_MouseY <= CLW_CaptionHeight + CLW_BorderHeight )
		{
			Gosub, NWD_SetAllOff
			Send, !{Esc}
			SYS_ToolTipText = Window Bottom
			Gosub, SYS_ToolTipFeedbackShow
		}
		Else
		{
			; the second condition checks for closeable window:
			; (WS_CAPTION | WS_SYSMENU)
			If ( (CLW_CtrlState = "D") or (CLW_WinStyle & 0xC80000 = 0xC80000) )
			{
				Gosub, NWD_SetAllOff
				WinClose, ahk_id %NWD_WinID%
				SYS_ToolTipText = Window Close
				Gosub, SYS_ToolTipFeedbackShow
			}
		}
	}
	Else
	{
		; TODO : workaround for "MouseClick, LEFT, , , 2" due to inactive titlebar problem
		
		; Thread, Priority, 1
		; CoordMode, Mouse, Screen
		; MouseGetPos, CLW_MouseX, CLW_MouseY
		; MouseClick, LEFT, %CLW_MouseX%, %CLW_MouseY%
		; Sleep, 10
		; MouseGetPos, CLW_MouseNewX, CLW_MouseNewY
		; MouseClick, LEFT, %CLW_MouseX%, %CLW_MouseY%
		; MouseMove, %CLW_MouseNewX%, %CLW_MouseNewY%
	}
Return

; [TSM {NWD}] toggles windows start menu || moves window to previous display || maximize to multiple windows on the left

/**
 * This additional button is used to toggle the windows start menu.
 */

$XButton1::
$^XButton1::
	If ( NWD_ImmediateDown )
		Return
		
	GetKeyState, TSM_RButtonState, RButton, P
	If ( TSM_RButtonState = "U" )
	{
		Send, {LWin}
	}
	Else
		IfWinActive, A
		{
			WinGet, TSM_WinID, ID
			If ( !TSM_WinID )
				Return
			WinGetClass, TSM_WinClass, ahk_id %TSM_WinID%

			If ( TSM_WinClass != "Progman" )
			{
				Gosub, NWD_SetAllOff
				GetKeyState, TSM_CtrlState, Ctrl, P
				If ( TSM_CtrlState = "U" )
				{
					Send, ^<
					SYS_ToolTipText = Window Move: LEFT
					Gosub, SYS_ToolTipFeedbackShow
				}
				; Else
				; TODO : maximize to multiple displays on the left (planned feature)
			}
		}
Return








; [MAW {NWD}] toggles window maximizing || moves window to next display || maximize to multiple windows on the right

/**
 * This additional button is used to toggle the maximize state of the active 
 * window (if maximizable).
 */

$XButton2::
$^XButton2::
	If ( NWD_ImmediateDown )
		Return
	
	IfWinActive, A
	{
		WinGet, MAW_WinID, ID
		If ( !MAW_WinID )
			Return
		WinGetClass, MAW_WinClass, ahk_id %MAW_WinID%
		If ( MAW_WinClass = "Progman" )
			Return
		
		GetKeyState, MAW_RButtonState, RButton, P
		If ( MAW_RButtonState = "U" )
		{
			GetKeyState, MAW_CtrlState, Ctrl, P
			WinGet, MAW_WinStyle, Style
			
			; the second condition checks for maximizable window:
			; (WS_CAPTION | WS_SYSMENU | WS_MAXIMIZEBOX)
			If ( (MAW_CtrlState = "D") or (MAW_WinStyle & 0xC90000 = 0xC90000) )
			{
				WinGet, MAW_MinMax, MinMax
				If ( MAW_MinMax = 0 )
				{
					WinMaximize
					SYS_ToolTipText = Window Maximize
					Gosub, SYS_ToolTipFeedbackShow
				}
				Else
					If ( MAW_MinMax = 1 )
					{
						WinRestore
						SYS_ToolTipText = Window Restore
						Gosub, SYS_ToolTipFeedbackShow
					}
			}
		}
		Else
		{
			Gosub, NWD_SetAllOff
			GetKeyState, MAW_CtrlState, Ctrl, P
			If ( MAW_CtrlState = "U" )
			{
				Send, ^>
				SYS_ToolTipText = Window Move: RIGHT
				Gosub, SYS_ToolTipFeedbackShow
			}
			; Else
			; TODO : maximize to multiple displays on the right (planned feature)
		}
	}
Return



; [EJC] opens/closes a drive

/**
 * Opens or closes an installed CD/DVD-ROM reader/writer drive tray. The drives 
 * are assigned to their hotkeys by the certain drive number in your system. The 
 * hotkeys are used in the sequence of the key placement on your physical 
 * keyboard from left to right (1 refers to the first and 0 to the tenth drive). 
 * So you are limited to a total number of 10 drives controlled by NiftyWindows.
 */

#MaxThreadsBuffer On
$#0::
$#1::
$#2::
$#3::
$#4::
$#5::
$#6::
$#7::
$#8::
$#9::
	DriveGet, EJC_DriveList, List, CDROM
	StringLen, EJC_DriveListLength, EJC_DriveList
	StringRight, EJC_PressedDrive, A_ThisHotkey, 1
	
	If ( !EJC_PressedDrive )
		EJC_PressedDrive := 10
	
	If ( EJC_PressedDrive <= EJC_DriveListLength )
	{
		StringMid, EJC_DriveLabel, EJC_DriveList, EJC_PressedDrive, 1
		SYS_ToolTipText = Drive Eject: %EJC_DriveLabel%
		Gosub, SYS_ToolTipFeedbackShow
		Gosub, SUS_SuspendSaveState
		Suspend, On
		Drive, Eject, %EJC_DriveLabel%:
		If ( A_TimeSinceThisHotkey < 250 )
			Drive, Eject, %EJC_DriveLabel%:, 1
		Gosub, SUS_SuspendRestoreState
	}
	Else
	{
		Transform, EJC_PressedDrive, Mod, %EJC_PressedDrive%, 10
		Send, #%EJC_PressedDrive%
	}
Return
#MaxThreadsBuffer Off



#^LButton::
#^MButton::
	Gosub, TRA_CheckWinIDs
	SetWinDelay, -1
	CoordMode, Mouse, Screen
	CoordMode, Pixel, Screen
	MouseGetPos, TRA_MouseX, TRA_MouseY, TRA_WinID
	If ( !TRA_WinID )
		Return
	WinGetClass, TRA_WinClass, ahk_id %TRA_WinID%
	If ( TRA_WinClass = "Progman" )
		Return
	
	IfWinNotActive, ahk_id %TRA_WinID%
		WinActivate, ahk_id %TRA_WinID%
	IfNotInString, TRA_WinIDs, |%TRA_WinID%
		TRA_WinIDs = %TRA_WinIDs%|%TRA_WinID%
	
	IfInString, A_ThisHotkey, MButton
	{
		AOT_WinID = %TRA_WinID%
		Gosub, AOT_SetOn
		TRA_WinAlpha%TRA_WinID% := 25 * 255 / 100
	}
	
	TRA_WinAlpha := TRA_WinAlpha%TRA_WinID%
	
	; TODO : the transparency must be set off first, 
	; this may be a bug of AutoHotkey
	WinSet, TransColor, OFF, ahk_id %TRA_WinID%
	PixelGetColor, TRA_PixelColor, %TRA_MouseX%, %TRA_MouseY%, RGB
	WinSet, TransColor, %TRA_PixelColor% %TRA_WinAlpha%, ahk_id %TRA_WinID%
	TRA_PixelColor%TRA_WinID% := TRA_PixelColor

	IfInString, A_ThisHotkey, MButton
		SYS_ToolTipText = Transparency: 25 `% + %TRA_PixelColor% color (RGB) + Always on Top
	Else
		SYS_ToolTipText = Transparency: %TRA_PixelColor% color (RGB)
	Gosub, SYS_ToolTipFeedbackShow
Return





; [EDT] edits this script in notepad

^#!F9::
	If ( A_IsCompiled )
		Return
	
	Gosub, SUS_SuspendSaveState
	Suspend, On
	MsgBox, 4129, Edit Handler - %SYS_ScriptInfo%, You pressed the hotkey for editing this script:`n`n%A_ScriptFullPath%`n`nDo you really want to edit?
	Gosub, SUS_SuspendRestoreState
	IfMsgBox, OK
		Run, notepad.exe %A_ScriptFullPath%
Return



; [MIR] toggles the visibility of last used miranda message container

/**
 * Toggles the visibility of the last used Miranda message container 
 * (if installed). Currently Miranda does not provide a hotkey to activate the 
 * last used message container if there is no unread message waiting for your 
 * attention. So this hotkey will make a container visible (if it is minimized) 
 * and activate it. If there is no existing message container, this hotkey will 
 * do nothing. 
 */

~^+u::
	IfExist, %MIR_MirandaFullPath%
	{
		Sleep, 500	
		SetTitleMatchMode, 3
		IfWinExist, ahk_class #32770
		{
			WinGetTitle, MIR_Title
			IfNotInString MIR_Title, Mail
				IfWinNotActive
					WinActivate
		}
	}
	Else
		Send, ^+u
Return





; [MIR] toggles the visibility of miranda buddy list

/**
 * Toggles the visibility of the Miranda buddy list (if installed). Currently 
 * Miranda does not provide a hotkey to activate the buddy list if the window 
 * is still visible. Instead the opened (but not activated) buddy list will be 
 * minimized. This is not expected so this NiftyWindows feature provides the 
 * needed service asked by so many people.
 */

^+b::
	IfExist, %MIR_MirandaFullPath%
	{
		SetTitleMatchMode, 3
		DetectHiddenWindows, On
		MIR_MirandaStart = 0
		IfWinNotExist, Miranda IM
		{
			Run, %MIR_MirandaFullPath%, %MIR_MirandaDir%
			WinWait, Miranda IM
			MIR_MirandaStart=1
			Sleep, 500
		}
		DetectHiddenWindows, Off
		IfWinActive, Miranda IM
		{
			If ( !MIR_MirandaStart )
				WinHide
		}
		Else
			IfWinExist, Miranda IM
				WinActivate
			Else
			{
				DetectHiddenWindows, On
				IfWinExist, Miranda IM
				{
					WinShow
					WinActivate
				}
			}
	}
	Else
		Send, ^+b
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
					SYS_TrayTipText = A full screen window was activated.`nNiftyWindows is suspended now.`nPress WIN+ESC to resume it again.
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
					SYS_TrayTipText = A full screen window was deactivated.`nNiftyWindows is resumed now.`nPress WIN+ESC to suspend it again.
					Gosub, SYS_TrayTipShow
					Gosub, TRY_TrayUpdate
				}
			}
		}
	}
Return