"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import ReactFlagsSelect from "react-flags-select";

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const localActive = useLocale();

  const onSelectChange = (code) => {
    const localeMap = {
      US: "en",
      DE: "de",
      FR: "fr",
    };

    const nextLocale = localeMap[code];

    startTransition(() => {
      const newPath = pathname.replace(`/${localActive}`, `/${nextLocale}`);
      router.replace(newPath);
    });
  };

  const currentCountryCode =
    localActive === "en" ? "US" : localActive.toUpperCase();

  return (
    <div className="w-32">
      <ReactFlagsSelect
        selected={currentCountryCode}
        onSelect={onSelectChange}
        countries={["US", "DE", "FR"]}
        customLabels={{ US: "English", DE: "Deutsch", FR: "Français" }}
        disabled={isPending}
        className="menu-flags"
      />
    </div>
  );
}
