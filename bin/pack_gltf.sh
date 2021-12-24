filename=$1
basename="${filename%%.*}"
extension="${filename#*.}"

# Keep mesh name and material name
gltfpack -i "$filename" -o "$basename"_pack_cc."$extension" -cc -kn -km
