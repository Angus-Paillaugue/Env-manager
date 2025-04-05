#!/bin/bash

# Script to validate that all locale directories in docs have identical structure

set -e

docsDir="$(dirname $0)/../docs"

# Check if docs directory exists
if [ ! -d "$docsDir" ]; then
    echo "Error: docs directory not found!"
    exit 1
fi

# Get all locale directories
locale_dirs=()
for dir in $docsDir/*/; do
    if [ -d "$dir" ]; then
        locale_dirs+=("$(basename "$dir")")
    fi
done

if [ ${#locale_dirs[@]} -eq 0 ]; then
    echo "Error: No locale directories found in docs!"
    exit 1
fi

echo "Found ${#locale_dirs[@]} locale directories: ${locale_dirs[*]}"

# Use 'en' as reference if it exists, otherwise use the first locale
reference_locale="${locale_dirs[0]}"
for locale in "${locale_dirs[@]}"; do
    if [ "$locale" = "en" ]; then
        reference_locale="en"
        break
    fi
done

echo "Using '${reference_locale}' as the reference locale"

# Create temporary files for structure comparison
ref_file=$(mktemp)

# Get reference structure - relative paths only
( cd "$docsDir/${reference_locale}" && find . -mindepth 1 | sort | while read -r item; do
    if [ -d "$item" ]; then
        echo "${item#./}/"
    else
        echo "${item#./}"
    fi
done ) > "$ref_file"

# Check each locale against the reference
has_errors=0

for locale in "${locale_dirs[@]}"; do
    if [ "$locale" != "$reference_locale" ]; then
        echo "Checking locale: $locale"

        # Get locale structure - relative paths only
        locale_file=$(mktemp)
        ( cd "$docsDir/${locale}" && find . -mindepth 1 | sort | while read -r item; do
            if [ -d "$item" ]; then
                echo "${item#./}/"
            else
                echo "${item#./}"
            fi
        done ) > "$locale_file"

        # Check if files are identical
        if ! cmp -s "$ref_file" "$locale_file"; then
            echo "Structure mismatch found in locale '$locale':"

            # List files only in reference
            echo "Only in reference ($reference_locale):"
            comm -23 "$ref_file" "$locale_file" | sed 's/^/  /'

            # List files only in current locale
            echo "Only in $locale:"
            comm -13 "$ref_file" "$locale_file" | sed 's/^/  /'

            has_errors=1
        else
            echo "Locale '$locale' matches the reference structure."
        fi

        # Clean up temporary file
        rm "$locale_file"
    fi
done

# Clean up reference file
rm "$ref_file"

if [ $has_errors -eq 1 ]; then
    echo "Errors were found! Some locales have different structures."
    exit 1
else
    echo "All locales have matching structures."
    exit 0
fi
