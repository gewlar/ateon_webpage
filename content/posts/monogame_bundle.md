---
title: "Bundling a Game Made with MonoGame"
subtitle: ""
date: 2025-06-05T21:24:00+02:00
lastmod: 2025-06-05T21:24:00+02:00
draft: false
description: "How to bundle a MonoGame project with the Steamworks API for Windows, Linux, and macOS"

tags: ["monogame", ".Net"]
---

While developing **Vulcard** for this year's iteration of the [Game Programming Lab](https://gtc.inf.ethz.ch/education/game-programming-laboratory/previous-years/2025.html) at ETH Zurich, we wanted to integrate the Steam API and package the game for multiple platforms. This process came with a few unexpected hurdles.

In this post, I'll walk through the complete solution we ended up using. If you're looking to publish a MonoGame project on Steam, this might save you some time.

<!--more-->

{{< admonition tip "What's Monogame?" false >}}
[MonoGame](https://monogame.net/)  is a cross-platform .NET framework for game development. It has for example been used to develop Stardew Valley.
{{< /admonition >}}



## General Setup
I assume you already have a working .NET 6+ (MonoGame) project and the corresponding SDK installed. You’ll also need a [Steamworks](https://partner.steamgames.com/) developer account to access the Steamworks SDK.

To make platform-specific builds easier, define platform detection constants in your `.csproj` file:
```xml { title="Vulcard.csproj" }
<PropertyGroup>
  <IsWindows Condition="'$(RuntimeIdentifier)' == 'win-x64' or ('$(RuntimeIdentifier)' == '' and $([MSBuild]::IsOSPlatform('Windows')))">true</IsWindows>
  <IsOSX Condition="'$(RuntimeIdentifier)' == 'osx-x64' or ('$(RuntimeIdentifier)' == '' and $([MSBuild]::IsOSPlatform('OSX')))">true</IsOSX>
  <IsLinux Condition="'$(RuntimeIdentifier)' == 'linux-x64' or ('$(RuntimeIdentifier)' == '' and $([MSBuild]::IsOSPlatform('Linux')))">true</IsLinux>
  
  <IsWindows Condition="'$(IsWindows)' == ''">false</IsWindows>
  <IsOSX Condition="'$(IsOSX)' == ''">false</IsOSX>
  <IsLinux Condition="'$(IsLinux)' == ''">false</IsLinux>
</PropertyGroup>
```

## Add Steamworks Dependencies

Download the Facepunch.Steamworks library directly from the [GitHub releases page](https://github.com/Facepunch/Facepunch.Steamworks/releases/) and extract the contents of the `net6.0` folder into a new folder in your project root called `Steamworks`.

Also, download the official Steamworks SDK directly from [Steamworks](https://partner.steamgames.com/downloads/list). As of writing, SDK version 1.61 works with the latest release of Facepunch.Steamworks. Copy the redistributable binaries (steam_api64.dll, libsteam_api.so, etc.) into the same Steamworks folder.

Your `Steamworks/` folder should now include:
```txt { title="Steamworks/" }
Facepunch.Steamworks.Posix.deps.json
Facepunch.Steamworks.Posix.dll
Facepunch.Steamworks.Posix.pdb
Facepunch.Steamworks.Posix.xml
Facepunch.Steamworks.Win64.deps.json
Facepunch.Steamworks.Win64.dll
Facepunch.Steamworks.Win64.pdb
Facepunch.Steamworks.Win64.xml
libsteam_api.dylib
libsteam_api.so
steam_api64.dll
```

{{< admonition tip "32-bit Support" false >}}
To support 32-bit Windows systems, you’ll need to include the appropriate 32-bit versions of the Steam libraries as well.
{{< /admonition >}}


Update the `.csproj` to reference the Facepunch.Steamworks and native libraries for the correct platform:

```xml { title="Vulcard.csproj" }
<ItemGroup>
  <!-- Reference Facepunch.Steamworks -->
  <Reference Include="Facepunch.Steamworks, Version=2.4.1, Culture=neutral, processorArchitecture=MSIL">
    <SpecificVersion>False</SpecificVersion>
    <HintPath Condition="$(IsWindows)">Steamworks/Facepunch.Steamworks.Win64.dll</HintPath>
    <HintPath Condition="$(IsOSX) or $(IsLinux)">Steamworks/Facepunch.Steamworks.Posix.dll</HintPath>
    <CopyToOutputDirectory>Always</CopyToOutputDirectory>
  </Reference>

  <!-- Include native Steamworks libaries -->
  <Content Include="Steamworks/steam_api64.dll" Condition="$(IsWindows)">
    <Link>steam_api64.dll</Link>
    <CopyToOutputDirectory>Always</CopyToOutputDirectory>
  </Content>

  <Content Include="Steamworks/libsteam_api.dylib" Condition="$(IsOSX)">
    <Link>Lib/libsteam_api.dylib</Link>
    <CopyToOutputDirectory>Always</CopyToOutputDirectory>
  </Content>

  <Content Include="Steamworks/libsteam_api.so" Condition="$(IsLinux)">
    <Link>libsteam_api.so</Link>
    <CopyToOutputDirectory>Always</CopyToOutputDirectory>
  </Content>
</ItemGroup>
```

{{< admonition note "libsteam_api.dylib" true >}}
The native steam library for macOS `libsteam_api.dylib` is copied directly into the `Lib` folder to conform with the app bundle structure for macOS.

This might mess with your setup if you are using macOS for development. If you know of a good way to force NetBeauty to automatically copy the file to the `Lib` folder during bundling, let me know. 
{{< /admonition >}}


If everything is working, you can initialize the Steam API in your code and check the connection.
```cs
public void Initialize()
{
    try
    {
        Steamworks.SteamClient.Init(480, true);

        var playername = Steamworks.SteamClient.Name;
    }
    catch (Exception e)
    {
        Debug.WriteLine("{0}", e);
    }
}
```

{{< admonition warning "App ID" true >}}
Replace `480` with your actual Steam App ID for a release. Facepunch.Steamworks also doesn't require a `steam_appid.txt` file.
{{< /admonition >}}

## Bundling Windows & Linux
Download [GameBundle](https://github.com/Ellpeck/GameBundle). This neat tool greatly simplifies the bundling process and provides a clean looking folder structure by using [NetBeauty](https://github.com/nulastudio/NetBeauty2) internally.

And that is it. You can now use the Steam API and bundle your game for Windows and Linux:
```bash
gamebundle -wl -z --mg
# -w: Build for Windows
# -l: Build for Linux
# -z: Zip output
# --mg: Don't move MonoGame's native libraries to the Lib folder
```
Note that Linux users will need to add the permissions to execute the game.

## Bundling macOS 
Bundling for macOS is a bit more involved and additionally requires a property list file and a separate icon.

Convert your existing game icon to the `icns` format and store the new file under `Icon.icns` directly in the root. Then create a new file called `Info.plist` also in the project root. 

Add the following content to the `Info.plist`. Replace `MyApp` with the name of your application and `com.example.MyApp` with your identifier.

```xml { title="Info.plist" }
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIconFile</key>
    <string>Icon</string>
    <key>CFBundleName</key>
    <string>MyApp</string>
    <key>CFBundleIdentifier</key>
    <string>com.example.MyApp</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
</dict>
</plist>
```

Finally, adjust your `.csproj` to include them during the build for macOS:
```xml { title="Vulcard.csproj" }
<ItemGroup Condition="$(IsOSX)">
  <Content Include="./Info.plist">
    <CopyToOutputDirectory>Always</CopyToOutputDirectory>
  </Content>
  <Content Include="./Icon.icns">
    <CopyToOutputDirectory>Always</CopyToOutputDirectory>
  </Content>
</ItemGroup>
```

Now you can also bundle your game for macOS again using GameBundle.
```bash
gamebundle -m -bz --mg --nbeauty2
# -m: Bundle for macOS
# -b: Output correct structure and create app bundle for macOS
# -z: Zip output
# --mg: Don't move MonoGame's native libraries to the Lib folder
# --nbeauty2: Use NetBeauty2 instead of NetCoreBeauty
```

{{< admonition info "Why --nbeauty2?" false >}}
The .Net version I used (8.0.410) does not have a patched .Net SDK for macOS in NetCoreBeauty.

NetBeauty2 uses a different setup, which works in that case. However, there are other drawbacks with NetBeauty2.
{{< /admonition >}}

{{< admonition warning "Signing & Notarization" false >}}
The setup shown here does not include signing and notarizing the app, which is required by Apple if you want to distribute the app.
{{< /admonition >}}

## Conclusion

You can now use the Steamworks API in your .Net project and bundle it for Windows, Linux and macOS. Hope this saves you some time.

See the [github repository](https://github.com/gewlar/monogame_example) for a basic setup that includes project structure, and configuration files.

{{< admonition type=note  open=false >}}
By the way you can find Vulcard on [Steam](https://store.steampowered.com/app/3764530/Vulcard).
{{< /admonition >}}