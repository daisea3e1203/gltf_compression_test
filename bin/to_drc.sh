filename=$1
basename="${filename%%.*}"
extension="${filename#*.}"

gltf-pipeline -i "$filename" -o "$basename"_what_drc."$extension" -d
