{
  description = "Jenkins ctl";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      utils,
    }:
    {
      overlays.default = final: prev: {
        k8s-config-generator = final.callPackage (
          { stdenv, pkgs, ... }:
          pkgs.buildNpmPackage {
            pname = "k8s-config-generator";
            version = "0.0.3";
            src = ./.;
            npmBuildScript = "bundle";
            npmDepsHash = "sha256-SRo1mcddfHDtETNconAf4ag5kED1UTUXipuvwUfjARY=";
            installPhase = ''
              mkdir -p $out/bin
              echo "#!/usr/bin/env node
              $(cat dist/k8s-config-generator.js)
              " > $out/bin/k8s-config-generator
              chmod +x $out/bin/k8s-config-generator
            '';
          }
        ) { };
      };
    }
    // (utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = (import nixpkgs) {
          inherit system;
          overlays = [ self.overlays.default ];
        };
      in
      {
        packages = {
          default = pkgs.k8s-config-generator;
          k8s-config-generator = pkgs.k8s-config-generator;
        };
        devShell = pkgs.mkShell {
          name = "Scrumdapp k8s generator";
          buildInputs = with pkgs; [
            nodejs_24
          ];

          shellHook = ''
            npm config set ignore-scripts true
            export KUBE_CONFIG=$PWD/kubeconfig
            echo "
            npm: $(npm -v)
            node: $(node -v)

            Welcome to the Scrumdapp k8s generator shell 🚀!
            ";
          '';
        };
      }
    ));
}
