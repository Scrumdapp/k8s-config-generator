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
    utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = (import nixpkgs) { inherit system; };
      in
      {
        devShell = pkgs.mkShell {
          name = "Scrumdapp k8s generator";
          buildInputs = with pkgs; [
            nodejs_24
          ];

          shellHook = ''
            export KUBE_CONFIG=$PWD/kubeconfig
            npm -v
            echo "
            Welcome to the Scrumdapp k8s generator shell 🚀!
            ";
          '';
        };
      }
    );
}
