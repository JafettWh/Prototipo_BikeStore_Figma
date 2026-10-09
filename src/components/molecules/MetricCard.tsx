import React from "react";
import Icon, { IconName } from "../atoms/Icon";

interface MetricCardProps {
  title: string;
  value: string;
  subtext: string;
  trend?: string;
  trendPositive?: boolean;
  iconName?: IconName;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  trend,
  trendPositive = true,
  iconName,
}) => {
  return (
    <div className="bg-white border border-[#dedfd9] p-6 flex flex-col justify-between text-left shadow-sm rounded-sm transition-all hover:border-black/20 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6d6f69]">
          {title}
        </span>
        {iconName && (
          <span className="w-8 h-8 rounded-full bg-[#f4f4f0] text-[#11120f] flex items-center justify-center">
            <Icon name={iconName} size={16} />
          </span>
        )}
      </div>

      <div className="my-3">
        <span className="font-['Barlow_Condensed'] font-bold text-3xl sm:text-4xl text-[#11120f] block tracking-tight">
          {value}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        {trend && (
          <span
            className={`font-bold flex items-center gap-0.5 ${
              trendPositive ? "text-[#167648]" : "text-red-600"
            }`}
          >
            {trend}
          </span>
        )}
        <span className="text-[11px] text-[#6d6f69]">{subtext}</span>
      </div>
    </div>
  );
};

export default MetricCard;
