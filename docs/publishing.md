# FluxUI Publishing Guide

This guide explains how to publish FluxUI bindings for Rust, Java, and Zig.
Do not commit tokens, passwords, private GPG keys, or generated build outputs.

## Before Any Public Release

Pick these values first:

- Version: `0.1.0` for the first public release.
- Repository: `https://github.com/camiloGHS21/DataleakGuard`.
- License: choose one and add a root `LICENSE` file. MIT or Apache-2.0 are common.
- Release tag: `v0.1.0`.
- Package names:
  - Rust crate: `fluxui` if available, otherwise `fluxui-native` or `fluxui-ui`.
  - Java Maven group: `io.github.camiloGHS21`.
  - Java Maven artifact: `fluxui-java`.
  - Zig package name: `fluxui`.

Public package releases are effectively immutable. If a version is bad, publish
a new version such as `0.1.1`; do not expect to overwrite `0.1.0`.

## Rust: crates.io

Official registry: `https://crates.io`

Official flow:

1. Create or verify your crates.io account.
2. Generate an API token at `https://crates.io/me`.
3. Log in locally:

```powershell
cargo login
```

Paste the token when Cargo asks. Keep it secret.

4. Add a `Cargo.toml` for the Rust binding. Minimal example:

```toml
[package]
name = "fluxui-native"
version = "0.1.0"
edition = "2021"
description = "Rust bindings for the native FluxUI desktop UI framework"
license = "MIT"
repository = "https://github.com/camiloGHS21/DataleakGuard"
homepage = "https://github.com/camiloGHS21/DataleakGuard"
readme = "README.md"
keywords = ["gui", "ui", "desktop", "native", "vulkan"]
categories = ["gui", "api-bindings"]
include = [
  "lib.rs",
  "README.md",
  "LICENSE",
]

[lib]
path = "lib.rs"
```

5. Add a `README.md` and `LICENSE` next to that `Cargo.toml`.
6. Test the package:

```powershell
cd bindings\rust
cargo package --list
cargo publish --dry-run
```

7. Publish:

```powershell
cargo publish
```

Important native-library note: the current Rust binding links to
`fluxui_shared`. For a smooth crates.io experience, either:

- publish the Rust crate as bindings only and document that users must build or
  install `fluxui_shared.dll/.so/.dylib`; or
- add a `build.rs` that builds the C++ core with CMake or locates a prebuilt
  native library through `FLUXUI_LIB_DIR`.

## Java: Maven Central

Official registry: Maven Central through Sonatype Central Portal.

Recommended coordinates:

```xml
<groupId>io.github.camiloGHS21</groupId>
<artifactId>fluxui-java</artifactId>
<version>0.1.0</version>
```

Setup:

1. Sign in at `https://central.sonatype.com`.
2. Use GitHub login. Sonatype can create the namespace
   `io.github.camiloGHS21` for that GitHub user.
3. Generate a Central Portal user token from your account page.
4. Add credentials to `~/.m2/settings.xml`:

```xml
<settings>
  <servers>
    <server>
      <id>central</id>
      <username>YOUR_TOKEN_USERNAME</username>
      <password>YOUR_TOKEN_PASSWORD</password>
    </server>
  </servers>
</settings>
```

5. Install and configure GPG. Maven Central requires `.asc` signatures.

```powershell
gpg --full-generate-key
gpg --list-secret-keys --keyid-format=long
gpg --keyserver keyserver.ubuntu.com --send-keys YOUR_KEY_ID
```

6. Create a Maven `pom.xml` for the Java binding. It must include:

- `name`
- `description`
- `url`
- `licenses`
- `developers`
- `scm`
- source jar
- javadoc jar
- GPG signing
- `central-publishing-maven-plugin`

7. Build and publish:

```powershell
mvn -P release clean deploy
```

By default the Central Portal validates the deployment first. If auto-publish is
off, finish from:

```text
https://central.sonatype.com/publishing/deployments
```

Important native-library note: Java users need both:

- `fluxui-java.jar`
- native libraries: `fluxui_java.dll` and `fluxui_shared.dll` on Windows

For a polished Maven Central release, publish platform-specific native artifacts,
for example:

- `fluxui-java`
- `fluxui-java-natives-windows-x86_64`
- later: `fluxui-java-natives-linux-x86_64`
- later: `fluxui-java-natives-macos-aarch64`

The current Java API already supports:

```java
FluxUI.loadFrom(Path.of("path/to/native/libs"));
```

That is enough for a first release, but automatic extraction from native jars
would be nicer for users later.

## Zig

Zig does not have an official central registry like crates.io or Maven Central.
The normal Zig package distribution flow is:

1. Add `build.zig` and `build.zig.zon`.
2. Tag a GitHub release, for example `v0.1.0`.
3. Users depend on the GitHub release tarball URL and hash.

Example `build.zig.zon`:

```zig
.{
    .name = "fluxui",
    .version = "0.1.0",
    .minimum_zig_version = "0.14.0",
    .paths = .{
        "build.zig",
        "bindings/zig/fluxui.zig",
        "fluxui/include",
        "LICENSE",
        "README.md",
    },
}
```

After pushing a tag:

```powershell
git tag v0.1.0
git push origin v0.1.0
```

Users can add it with:

```powershell
zig fetch --save https://github.com/camiloGHS21/DataleakGuard/archive/refs/tags/v0.1.0.tar.gz
```

That command writes the dependency URL and hash into their `build.zig.zon`.

## Release Order I Recommend

1. Add `LICENSE` and public `README.md`.
2. Tag `v0.1.0` on GitHub.
3. Publish Zig by GitHub release/tag first.
4. Publish Rust crate with `cargo publish --dry-run`, then `cargo publish`.
5. Publish Java to Maven Central after GPG and namespace are ready.

Java is the slowest because Maven Central validation is strict and native
libraries require more packaging care.
