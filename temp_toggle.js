        function toggleSection(sectionNumber) {
            console.log("Toggling section:", sectionNumber);
            const section = document.getElementById(`section-${sectionNumber}`);
            const chevron = document.getElementById(`chevron-${sectionNumber}`);
            
            if (!section || !chevron) {
                console.error("Element not found for section:", sectionNumber);
                return;
            }
            
            if (section.classList.contains("hidden")) {
                section.classList.remove("hidden");
                chevron.setAttribute("data-lucide", "chevron-up");
                console.log("Expanding section:", sectionNumber);
            } else {
                section.classList.add("hidden");
                chevron.setAttribute("data-lucide", "chevron-down");
                console.log("Collapsing section:", sectionNumber);
            }
            
            // Re-initialize icons after changing attributes
            if (typeof lucide !== "undefined" && lucide.createIcons) {
                lucide.createIcons();
            }
        }
